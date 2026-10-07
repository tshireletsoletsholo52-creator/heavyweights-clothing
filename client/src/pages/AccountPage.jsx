import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';

export default function AccountPage() {
  const { user, loading, login, signup, logout, token } = useAuth();
  const { formatPrice } = useCurrency();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    fetch('/api/orders/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, [user, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bone">
        <Navbar />
        <p className="p-10 text-stone">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bone">
        <Navbar />
        <div className="max-w-sm mx-auto px-6 py-16">
          <div className="flex gap-4 mb-8 border-b border-ink/10">
            <button
              onClick={() => setMode('login')}
              className={`pb-3 font-display text-lg ${mode === 'login' ? 'border-b-2 border-ink' : 'text-stone'}`}
            >
              Log In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`pb-3 font-display text-lg ${mode === 'signup' ? 'border-b-2 border-ink' : 'text-stone'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'signup' && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-ink px-4 py-3 text-sm bg-bone"
              />
            )}
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-ink px-4 py-3 text-sm bg-bone"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-ink px-4 py-3 text-sm bg-bone"
            />
            {formError && <p className="text-rust text-sm">{formError}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="bg-ink text-bone py-3 font-semibold uppercase tracking-wide text-sm hover:bg-rust transition-colors disabled:opacity-60"
            >
              {submitting ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="font-display text-3xl mb-1">
              {user.name ? `Hi, ${user.name}` : 'My Account'}
            </h1>
            <p className="text-stone text-sm">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="text-sm underline text-stone hover:text-rust"
          >
            Log Out
          </button>
        </div>

        <h2 className="font-display text-xl mb-4">Order History</h2>
        {ordersLoading && <p className="text-stone text-sm">Loading orders...</p>}
        {!ordersLoading && orders.length === 0 && (
          <p className="text-stone text-sm">No orders yet.</p>
        )}
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-ink/10 p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="uppercase text-stone">{order.status}</span>
              </div>
              {order.items.map((item) => (
                <p key={item.id} className="text-sm text-stone">
                  {item.quantity}× {item.variant.product.name} ({item.variant.size}/{item.variant.color})
                </p>
              ))}
              <p className="text-sm font-semibold mt-2">{formatPrice(order.totalAmount)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
