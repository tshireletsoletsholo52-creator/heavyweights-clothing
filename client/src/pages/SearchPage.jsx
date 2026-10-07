import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const results = query.trim()
    ? products.filter((p) =>
        `${p.name} ${p.category}`.toLowerCase().includes(query.trim().toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-bone">
      <Navbar />
      <div className="px-6 md:px-10 py-10">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full max-w-xl border-b-2 border-ink bg-transparent text-2xl md:text-3xl font-display py-3 focus:outline-none"
        />

        <div className="mt-10">
          {loading && <p className="text-stone">Loading...</p>}

          {!loading && !query.trim() && (
            <p className="text-stone">Start typing to search the catalog.</p>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <p className="text-stone">No products match "{query}".</p>
          )}

          {results.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
