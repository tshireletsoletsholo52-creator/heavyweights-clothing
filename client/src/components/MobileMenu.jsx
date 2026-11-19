import { Link } from 'react-router-dom';

const BONE = '#F5F3EF';
const INK = '#0E0E0E';

export default function MobileMenu({ open, onClose }) {
  const linkStyle = {
    display: 'block',
    padding: '14px 0',
    borderBottom: '1px solid rgba(14,14,14,0.15)',
    color: INK,
    textDecoration: 'none',
  };

  return (
    <div className="lg:hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(14,14,14,0.6)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 300ms',
          zIndex: 90,
        }}
      />

      {/* Side panel */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: 'min(82vw, 320px)',
          backgroundColor: BONE,
          color: INK,
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 300ms ease',
          zIndex: 100,
          boxShadow: open ? '4px 0 24px rgba(0,0,0,0.25)' : 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(14,14,14,0.15)',
          }}
        >
          <span className="font-display" style={{ fontSize: 18 }}>MENU</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{ fontSize: 28, lineHeight: 1, background: 'none', border: 0, color: INK, cursor: 'pointer' }}
          >
            ×
          </button>
        </div>

        <nav className="font-display" style={{ padding: '16px 24px', fontSize: 18 }}>
          <Link to="/" onClick={onClose} style={linkStyle}>New</Link>
          <Link to="/" onClick={onClose} style={linkStyle}>Apparel</Link>
          <Link to="/" onClick={onClose} style={linkStyle}>Accessories</Link>
        </nav>

        <div
          style={{
            marginTop: 'auto',
            padding: '24px',
            borderTop: '1px solid rgba(14,14,14,0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            fontSize: 14,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          <Link to="/search" onClick={onClose} style={{ color: INK, textDecoration: 'none' }}>Search</Link>
          <Link to="/account" onClick={onClose} style={{ color: INK, textDecoration: 'none' }}>Account</Link>
        </div>
      </aside>
    </div>
  );
}