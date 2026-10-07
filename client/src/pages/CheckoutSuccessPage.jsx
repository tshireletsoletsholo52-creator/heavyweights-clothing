import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { clearCart } = useCart();

  useEffect(() => {
    // The webhook is what actually creates the order in the database —
    // this page just confirms to the customer and clears their local cart.
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-bone">
      <Navbar />
      <div className="px-6 md:px-10 py-20 text-center max-w-lg mx-auto">
        <h1 className="font-display text-3xl mb-4">Order Confirmed</h1>
        <p className="text-stone mb-2">
          Thanks for your order — a confirmation is on its way to your email.
        </p>
        {sessionId && (
          <p className="text-stone text-xs mb-8">Reference: {sessionId}</p>
        )}
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
