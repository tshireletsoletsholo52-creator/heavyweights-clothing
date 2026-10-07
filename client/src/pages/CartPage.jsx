import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const { formatPrice } = useCurrency();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const handleCheckout = async () => {
    setCheckingOut(true);
    setCheckoutError(null);
    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url; // redirect to Stripe's hosted page
    } catch (err) {
      setCheckoutError(err.message);
      setCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-bone">
        <Navbar />
        <div className="px-6 md:px-10 py-16 text-center">
          <h1 className="font-display text-3xl mb-4">Your cart is empty</h1>
          <Link
            to="/"
            className="inline-block bg-ink text-bone px-6 py-3 font-semibold uppercase text-sm hover:bg-rust transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone">
      <Navbar />
      <div className="px-6 md:px-10 py-10 max-w-4xl mx-auto">
        <h1 className="font-display text-3xl mb-8">Your Cart</h1>

        <div className="divide-y divide-stone/20">
          {items.map((item) => (
            <div key={item.variantId} className="flex gap-4 py-6">
              <div className="w-24 aspect-[4/5] bg-stone/10 overflow-hidden flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-stone text-sm">
                    Size {item.size} · {item.color}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center border border-ink">
                    <button
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity - 1)
                      }
                      className="w-8 h-8 hover:bg-ink hover:text-bone transition-colors"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.variantId, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.stockAvailable}
                      className="w-8 h-8 hover:bg-ink hover:text-bone transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="text-stone text-sm underline hover:text-rust"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <p className="font-semibold text-sm">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-ink flex justify-between items-center">
          <span className="font-display text-xl">Total</span>
          <span className="font-display text-xl">
            {formatPrice(totalPrice)}
          </span>
        </div>

        {checkoutError && (
          <p className="text-rust text-sm mt-4">{checkoutError}</p>
        )}

        <button
          onClick={handleCheckout}
          disabled={checkingOut}
          className="w-full mt-6 bg-rust text-bone py-4 font-semibold uppercase tracking-wide text-sm hover:bg-ink transition-colors disabled:opacity-60"
        >
          {checkingOut ? 'Redirecting to checkout...' : 'Checkout'}
        </button>
      </div>
    </div>
  );
}
