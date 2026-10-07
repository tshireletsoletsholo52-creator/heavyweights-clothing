import { Link } from 'react-router-dom';

export default function MobileMenu({ open, onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-ink/60 z-40 transition-opacity duration-300 lg:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div
        className={`fixed top-0 left-0 h-full w-[80%] max-w-sm bg-bone text-ink z-50 transform transition-transform duration-300 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink/10">
          <span className="font-display text-lg">MENU</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-2xl leading-none w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <nav className="flex flex-col px-6 py-6 gap-1 text-lg font-display">
          <Link to="/" onClick={onClose} className="py-3 border-b border-ink/10 hover:text-rust transition-colors">
            New
          </Link>
          <Link to="/" onClick={onClose} className="py-3 border-b border-ink/10 hover:text-rust transition-colors">
            Apparel
          </Link>
          <Link to="/" onClick={onClose} className="py-3 border-b border-ink/10 hover:text-rust transition-colors">
            Accessories
          </Link>
        </nav>

        <div className="px-6 py-6 mt-auto border-t border-ink/10 flex flex-col gap-3 text-sm uppercase tracking-wide">
          <Link to="/search" onClick={onClose} className="text-left hover:text-rust transition-colors">
            Search
          </Link>
          <Link to="/account" onClick={onClose} className="text-left hover:text-rust transition-colors">
            Account
          </Link>
        </div>
      </div>
    </>
  );
}
