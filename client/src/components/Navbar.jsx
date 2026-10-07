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
    <header className="sticky top-0 z-50 bg-ink text-bone">
      <div className="flex items-center justify-between px-6 py-4 md:px-10">
        {/* Hamburger button — shows until "lg", since "md" alone leaves no
            room for the full desktop nav + icons on narrower/portrait screens */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="lg:hidden flex flex-col justify-center gap-1.5 w-6 h-6"
        >
          <span className="block h-0.5 w-full bg-bone"></span>
          <span className="block h-0.5 w-full bg-bone"></span>
          <span className="block h-0.5 w-3/4 bg-bone"></span>
        </button>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex gap-8 text-sm font-medium tracking-wide uppercase">
          <a href="#" className="hover:text-rust transition-colors">New</a>
          <a href="#" className="hover:text-rust transition-colors">Apparel</a>
          <a href="#" className="hover:text-rust transition-colors">Accessories</a>
        </nav>

        <Link to="/" className="font-display text-lg md:text-xl tracking-tight whitespace-nowrap">
          HEAVYWEIGHTS
        </Link>

        <div className="flex items-center gap-4 md:gap-6 text-sm font-medium uppercase">
          {!loading && <span className="text-stone hidden sm:inline">{currency}</span>}
          <Link to="/search" className="hidden lg:inline hover:text-rust transition-colors">
            Search
          </Link>
          <Link to="/account" className="hidden lg:inline hover:text-rust transition-colors">
            Account
          </Link>
          <Link to="/cart" className="hover:text-rust transition-colors whitespace-nowrap">
            Cart ({totalItems})
          </Link>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
