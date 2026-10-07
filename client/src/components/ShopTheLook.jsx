import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

// Hardcoded for now — pairs the campaign shot with the two products worn in it.
// Once more lifestyle shots exist, this can become a list of multiple looks.
const look = {
  image: '/images/campaign-hero.jpg',
  products: [
    { name: 'Wave Logo Hoodie', slug: 'wave-logo-hoodie', price: 8500 },
    { name: 'Cargo Track Pants', slug: 'cargo-track-pants', price: 9500 },
  ],
};

export default function ShopTheLook() {
  const { formatPrice } = useCurrency();

  return (
    <section className="px-6 md:px-10 py-16 bg-ink text-bone">
      <h2 className="font-display text-2xl md:text-3xl mb-8">Shop The Look</h2>
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-black">
          <img
            src={look.image}
            alt="Shop the look"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col gap-4">
          {look.products.map((product) => (
            <Link
              key={product.slug}
              to={`/products/${product.slug}`}
              className="flex items-center justify-between border-b border-bone/20 pb-4 hover:text-rust transition-colors"
            >
              <span className="font-medium">{product.name}</span>
              <span className="text-stone">{formatPrice(product.price)}</span>
            </Link>
          ))}
          <Link
            to={`/products/${look.products[0].slug}`}
            className="mt-4 inline-block bg-rust text-bone px-6 py-3 font-semibold uppercase tracking-wide text-sm hover:bg-bone hover:text-ink transition-colors w-fit"
          >
            Shop This Look
          </Link>
        </div>
      </div>
    </section>
  );
}
