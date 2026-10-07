import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import CategoryShortcuts from '../components/CategoryShortcuts';
import ShopTheLook from '../components/ShopTheLook';
import NewsletterSignup from '../components/NewsletterSignup';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-bone">
      <Navbar />
      <Hero />

      <section id="shop" className="px-6 md:px-10 py-16">
        <h2 className="font-display text-3xl md:text-4xl mb-8">
          Latest Drop
        </h2>

        {loading && <p className="text-stone">Loading products...</p>}
        {error && (
          <p className="text-rust">
            Couldn't load products: {error}. Make sure the backend server is
            running on port 4000.
          </p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <CategoryShortcuts />
      <ShopTheLook />
      <NewsletterSignup />
    </div>
  );
}
