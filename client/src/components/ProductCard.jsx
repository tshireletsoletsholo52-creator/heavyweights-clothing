import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const { formatPrice } = useCurrency();

  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-stone/10">
          <img
            src={product.images[0]}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              hovered ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <img
            src={product.images[1] || product.images[0]}
            alt={`${product.name} alternate view`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {totalStock === 0 && (
            <span className="absolute top-3 left-3 bg-ink text-bone text-xs font-semibold uppercase tracking-wide px-3 py-1">
              Sold Out
            </span>
          )}

          {/* Size selector slides up on hover. Clicking a size takes you to
              the product page too (for now) rather than adding to cart directly,
              since real add-to-cart needs the detail page's state. */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-bone/95 flex justify-center gap-2 py-3 transition-transform duration-300 ${
              hovered ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            {sizes.map((size) => {
              const variant = product.variants.find((v) => v.size === size);
              const inStock = variant && variant.stock > 0;
              return (
                <span
                  key={size}
                  className={`text-xs font-semibold w-8 h-8 border flex items-center justify-center ${
                    inStock
                      ? 'border-ink hover:bg-ink hover:text-bone'
                      : 'border-stone text-stone line-through'
                  }`}
                >
                  {size}
                </span>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex justify-between items-start">
          <div>
            <h3 className="font-medium text-sm">{product.name}</h3>
            <p className="text-stone text-sm">{product.category}</p>
          </div>
          <span className="font-semibold text-sm">{formatPrice(product.basePrice)}</span>
        </div>
      </Link>
    </div>
  );
}
