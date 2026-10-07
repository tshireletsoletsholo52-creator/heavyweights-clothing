// Seeds the database with a handful of fake products so we have data
// to build the front-end against before real product photos/info exist.
//
// Run with: node prisma/seed.js

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const products = [


 {
  name: 'Wave Logo Hoodie',
  slug: 'wave-logo-hoodie',
  description: 'Zip-up hoodie with oversized wave graphic and embroidered HW logo. Relaxed, oversized fit.',
  basePrice: 8500,
  category: 'Hoodies',
  images: ['/products/hoodie-olive-front.jpg'],
  variants: [
    { size: 'S', color: 'Olive/White', sku: 'WAVE-OLV-S', stock: 12, images: ['/products/hoodie-olive-front.jpg', '/products/hoodie-olive-alt.jpg'] },
    { size: 'M', color: 'Olive/White', sku: 'WAVE-OLV-M', stock: 8, images: ['/products/hoodie-olive-front.jpg', '/products/hoodie-olive-alt.jpg'] },
    { size: 'L', color: 'Olive/White', sku: 'WAVE-OLV-L', stock: 0, images: ['/products/hoodie-olive-front.jpg', '/products/hoodie-olive-alt.jpg'] },
    { size: 'S', color: 'Green/Yellow', sku: 'WAVE-GRN-S', stock: 6, images: ['/products/hoodie-green-front.jpg', '/products/hoodie-green-alt.jpg'] },
    { size: 'M', color: 'Green/Yellow', sku: 'WAVE-GRN-M', stock: 10, images: ['/products/hoodie-green-front.jpg', '/products/hoodie-green-alt.jpg'] },
  ],
},
  {
    name: 'Cargo Track Pants',
    slug: 'cargo-track-pants',
    description: 'Technical fabric track pants with cargo pockets and tapered ankle.',
    basePrice: 9500,
    category: 'Bottoms',
    images: [
      'https://placehold.co/800x1000?text=Pants+Front',
      'https://placehold.co/800x1000?text=Pants+Back',
    ],
    variants: [
      { size: 'S', color: 'Black', sku: 'PANT-BLK-S', stock: 10 },
      { size: 'M', color: 'Black', sku: 'PANT-BLK-M', stock: 10 },
      { size: 'L', color: 'Black', sku: 'PANT-BLK-L', stock: 0 }, // out of stock
    ],
  },
{
  name: 'Heavy Weights Tee',
  slug: 'heavy-weights-tee',
  description: 'Boxing gloves chest print with an oversized illustrated back graphic. 100% heavyweight cotton.',
  basePrice: 4500,
  category: 'T-Shirts',
  images: ['/products/tee-front.jpg'],
  variants: [
    { size: 'S', color: 'White', sku: 'HWTEE-WHT-S', stock: 15, images: ['/products/tee-front.jpg', '/products/tee-back.jpg'] },
    { size: 'M', color: 'White', sku: 'HWTEE-WHT-M', stock: 15, images: ['/products/tee-front.jpg', '/products/tee-back.jpg'] },
    { size: 'L', color: 'White', sku: 'HWTEE-WHT-L', stock: 15, images: ['/products/tee-front.jpg', '/products/tee-back.jpg'] },
  ],
},
{
  name: 'HW Ribbed Beanie',
  slug: 'hw-ribbed-beanie',
  description: 'Ribbed knit beanie with contrast stripe detail and embroidered HW logo.',
  basePrice: 3000,
  category: 'Accessories',
  images: ['/products/beanie.jpg'],
  variants: [
    { size: 'One Size', color: 'White/Grey', sku: 'BEANIE-WG-OS', stock: 20, images: ['/products/beanie.jpg'] },
  ],
},
];

async function main() {
  console.log('Seeding database...');

  for (const productData of products) {
    const { variants, ...productFields } = productData;

    const product = await prisma.product.create({
      data: {
        ...productFields,
        variants: {
          create: variants,
        },
      },
    });

    console.log(`Created product: ${product.name}`);
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
