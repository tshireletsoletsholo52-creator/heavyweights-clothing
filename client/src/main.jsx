import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { CurrencyProvider } from './context/CurrencyContext'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
// ...
<BrowserRouter>
  <AuthProvider>
    <CurrencyProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </CurrencyProvider>
  </AuthProvider>
</BrowserRouter>