import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyStatus, setNotifyStatus] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        // default to the first color that has any stock, falling back to the first color at all
        const colors = [...new Set(data.variants.map((v) => v.color))];
        const firstInStockColor = colors.find((c) =>
          data.variants.some((v) => v.color === c && v.stock > 0)
        );
        setSelectedColor(firstInStockColor || colors[0]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    setSelectedSize(null);
    setActiveImage(0);
    setNotifyStatus(null);
  }, [selectedColor]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bone">
        <Navbar />
        <p className="p-10 text-stone">Loading...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-bone">
        <Navbar />
        <div className="p-10">
          <p className="text-rust mb-4">Product not found.</p>
          <Link to="/" className="underline text-sm">Back to shop</Link>
        </div>
      </div>
    );
  }

  const colors = [...new Set(product.variants.map((v) => v.color))];
  const sizesForColor = product.variants.filter((v) => v.color === selectedColor);
  // images are stored per-variant (per-color); any variant of this color shares the same image set
  const galleryImages =
    sizesForColor[0]?.images?.length > 0 ? sizesForColor[0].images : product.images;

  const selectedVariant = sizesForColor.find((v) => v.size === selectedSize);
  const isSelectedInStock = selectedVariant && selectedVariant.stock > 0;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem(product, selectedVariant, 1);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    if (!selectedVariant || !notifyEmail) return;
    setNotifyStatus('sending');
    try {
      const res = await fetch('/api/restock-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: notifyEmail, variantId: selectedVariant.id }),
      });
      if (!res.ok) throw new Error();
      setNotifyStatus('success');
    } catch {
      setNotifyStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-bone">
      <Navbar />

      <div className="grid md:grid-cols-2 gap-10 px-6 md:px-10 py-10">
        {/* Image gallery */}
        <div>
          <div className="aspect-[4/5] bg-stone/10 overflow-hidden mb-3">
            <img
              src={galleryImages[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-3">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-20 aspect-[4/5] overflow-hidden border-2 ${
                  activeImage === i ? 'border-ink' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="max-w-md">
          <p className="text-stone text-sm uppercase tracking-wide mb-1">{product.category}</p>
          <h1 className="font-display text-3xl mb-3">{product.name}</h1>
          <p className="font-semibold text-lg mb-6">{formatPrice(product.basePrice)}</p>
          <p className="text-stone mb-8">{product.description}</p>

          {/* Color selector */}
          {colors.length > 1 && (
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide mb-3">
                Color — {selectedColor}
              </p>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 h-10 border text-sm font-medium transition-colors ${
                      selectedColor === color
                        ? 'bg-ink text-bone border-ink'
                        : 'border-ink hover:bg-ink hover:text-bone'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide mb-3">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizesForColor.map((variant) => {
                const inStock = variant.stock > 0;
                const isSelected = selectedSize === variant.size;
                return (
                  <button
                    key={variant.size}
                    onClick={() => setSelectedSize(variant.size)}
                    className={`w-12 h-12 border text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-ink text-bone border-ink'
                        : inStock
                        ? 'border-ink hover:bg-ink hover:text-bone'
                        : 'border-stone text-stone'
                    }`}
                  >
                    {variant.size}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedSize && isSelectedInStock && (
            <button
              onClick={handleAddToCart}
              className="w-full bg-rust text-bone py-4 font-semibold uppercase tracking-wide text-sm hover:bg-ink transition-colors"
            >
              {addedToCart ? 'Added ✓' : 'Add to Cart'}
            </button>
          )}

          {selectedSize && !isSelectedInStock && (
            <div className="border border-stone/40 p-5">
              <p className="text-sm font-semibold mb-1">This size is out of stock</p>
              <p className="text-stone text-sm mb-4">
                Leave your email and we'll let you know the moment it's back.
              </p>
              {notifyStatus === 'success' ? (
                <p className="text-rust text-sm font-medium">
                  You're on the list — we'll email you when it's back.
                </p>
              ) : (
                <form onSubmit={handleNotifySubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 border border-ink px-3 py-2 text-sm bg-bone"
                  />
                  <button
                    type="submit"
                    disabled={notifyStatus === 'sending'}
                    className="bg-ink text-bone px-4 py-2 text-sm font-semibold uppercase whitespace-nowrap hover:bg-rust transition-colors"
                  >
                    {notifyStatus === 'sending' ? 'Sending...' : 'Notify Me'}
                  </button>
                </form>
              )}
              {notifyStatus === 'error' && (
                <p className="text-rust text-sm mt-2">Something went wrong — try again.</p>
              )}
            </div>
          )}

          {!selectedSize && (
            <p className="text-stone text-sm">Select a size to continue.</p>
          )}
        </div>
      </div>
    </div>
  );
}