require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const app = express();
app.use(cors());

// IMPORTANT: the webhook route must come before express.json(), and must
// use express.raw() instead — Stripe needs the raw, untouched request body
// to verify the signature. If this is parsed as JSON first, verification
// will always fail.
app.post(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const cartItems = JSON.parse(session.metadata.cartItems);

      try {
        // Create the order and decrement stock in a single transaction —
        // if anything fails partway through, everything rolls back rather
        // than leaving stock counts wrong.
        await prisma.$transaction(async (tx) => {
                    const order = await tx.order.create({
            data: {
              status: 'paid',
              totalAmount: session.amount_total,
              stripeSessionId: session.id,
              customerId: session.metadata.customerId || null,
              items: {
                create: cartItems.map((item) => ({
                  variantId: item.variantId,
                  quantity: item.quantity,
                  price: item.price,
                })),
              },
            },
          });

          for (const item of cartItems) {
            await tx.variant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.quantity } },
            });
          }

          return order;
        });

        console.log(`Order created for session ${session.id}`);
      } catch (err) {
        console.error('Failed to create order from webhook:', err);
        // Still return 200 so Stripe doesn't keep retrying indefinitely —
        // log this for manual follow-up instead.
      }
    }

    res.json({ received: true });
  }
);

app.use(express.json());
// Reads the JWT from the Authorization header if present, attaches the
// logged-in customer's id to req.customerId. Doesn't block unauthenticated
// requests — routes decide for themselves if login is required.
function attachCustomer(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.customerId = payload.customerId;
    } catch {
      // invalid/expired token — proceed unauthenticated
    }
  }
  next();
}
app.use(attachCustomer);

function requireAuth(req, res, next) {
  if (!req.customerId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
}

app.post('/api/auth/signup', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'An account with that email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await prisma.customer.create({
      data: { email, password: hashedPassword, name },
    });
    const token = jwt.sign({ customerId: customer.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ token, customer: { id: customer.id, email: customer.email, name: customer.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const valid = await bcrypt.compare(password, customer.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ customerId: customer.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, customer: { id: customer.id, email: customer.email, name: customer.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.customerId },
      select: { id: true, email: true, name: true, createdAt: true },
    });
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load account' });
  }
});

app.get('/api/orders/me', requireAuth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.customerId },
      include: { items: { include: { variant: { include: { product: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load orders' });
  }
});
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { variants: true },
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:slug', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { variants: true },
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/restock-subscribe', async (req, res) => {
  const { email, variantId } = req.body;
  if (!email || !variantId) {
    return res.status(400).json({ error: 'Email and variantId are required' });
  }
  try {
    const subscriber = await prisma.restockSubscriber.upsert({
      where: { email_variantId: { email, variantId } },
      update: {},
      create: { email, variantId },
    });
    res.status(201).json(subscriber);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

app.post('/api/checkout/create-session', async (req, res) => {
  const { items } = req.body; // [{ variantId, name, size, color, price, quantity, image }]

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  try {
    // Re-check stock server-side before creating the session — never trust
    // the client's cart blindly, someone could have bought the last one
    // since the customer added it.
    for (const item of items) {
      const variant = await prisma.variant.findUnique({
        where: { id: item.variantId },
      });
      if (!variant || variant.stock < item.quantity) {
        return res.status(400).json({
          error: `${item.name} (${item.size}) is no longer available in that quantity`,
        });
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd', // charges always happen in USD regardless of displayed currency
         product_data: {
  name: `${item.name} — ${item.size} / ${item.color}`,
  images: item.image && item.image.startsWith('http') ? [item.image] : [],
},
          unit_amount: item.price, // price is already in cents
        },
        quantity: item.quantity,
      })),
           metadata: {
        // stash the cart as JSON so the webhook can rebuild the order
        cartItems: JSON.stringify(
          items.map((i) => ({ variantId: i.variantId, quantity: i.quantity, price: i.price }))
        ),
        customerId: req.customerId || '',
      },
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});