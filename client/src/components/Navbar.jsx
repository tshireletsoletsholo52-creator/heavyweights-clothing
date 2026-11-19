import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const { totalItems } = useCart();
  const { currency, loading } = useCurrency();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-bone text-ink border-b border-ink/10">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-4 lg:px-10">
          {/* Left: hamburger (mobile) or links (desktop) */}
          <div className="flex items-center">
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="lg:hidden flex flex-col justify-center gap-1.5 w-7 h-7"
            >
              <span style={{ display: 'block', height: 2, width: '100%', backgroundColor: '#0E0E0E' }}></span>
              <span style={{ display: 'block', height: 2, width: '100%', backgroundColor: '#0E0E0E' }}></span>
              <span style={{ display: 'block', height: 2, width: '75%', backgroundColor: '#0E0E0E' }}></span>
            </button>

            <nav className="hidden lg:flex gap-8 text-sm font-medium tracking-wide uppercase">
              <Link to="/" className="hover:text-rust transition-colors">New</Link>
              <Link to="/" className="hover:text-rust transition-colors">Apparel</Link>
              <Link to="/" className="hover:text-rust transition-colors">Accessories</Link>
            </nav>
          </div>

          {/* Center: logo */}
          <Link to="/" className="font-display text-lg md:text-xl tracking-tight whitespace-nowrap">
            HEAVYWEIGHTS
          </Link>

          {/* Right: currency, search, account, cart */}
          <div className="flex items-center justify-end gap-4 lg:gap-6 text-sm font-medium uppercase">
            {!loading && <span className="text-stone hidden sm:inline">{currency}</span>}
            <Link to="/search" className="hidden lg:inline hover:text-rust transition-colors">Search</Link>
            <Link to="/account" className="hidden lg:inline hover:text-rust transition-colors">Account</Link>
            <Link to="/cart" className="hover:text-rust transition-colors whitespace-nowrap">
              Cart ({totalItems})
            </Link>
          </div>
        </div>
      </header>

      {/* Rendered OUTSIDE the header so the fixed panel covers the full screen */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}