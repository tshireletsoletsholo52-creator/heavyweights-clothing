import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import AccountPage from './pages/AccountPage';
import SearchPage from './pages/SearchPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products/:slug" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  );
}

export default App;