import { createContext, useContext, useEffect, useState } from 'react';

const CurrencyContext = createContext(null);
const CACHE_KEY = 'heavyweights_currency_cache';
const CACHE_HOURS = 12; // how long to trust cached detection/rates before re-checking

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState('USD');
  const [rate, setRate] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function detectCurrency() {
      // Use a cached result if it's recent, so we're not hitting these
      // free APIs on every single page load (they have rate limits).
      try {
        const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
        if (cached && Date.now() - cached.timestamp < CACHE_HOURS * 60 * 60 * 1000) {
          setCurrency(cached.currency);
          setRate(cached.rate);
          setLoading(false);
          return;
        }
      } catch {
        // ignore bad cache, fall through to a fresh lookup
      }

      try {
        // Step 1: figure out the visitor's country/currency from their IP
        const geoRes = await fetch('https://ipapi.co/json/');
        const geoData = await geoRes.json();
        const detectedCurrency = geoData.currency || 'USD';

        // Step 2: get live USD -> [currency] exchange rate
        const rateRes = await fetch('https://open.er-api.com/v6/latest/USD');
        const rateData = await rateRes.json();
        const detectedRate = rateData.rates?.[detectedCurrency] || 1;

        setCurrency(detectedCurrency);
        setRate(detectedRate);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            currency: detectedCurrency,
            rate: detectedRate,
            timestamp: Date.now(),
          })
        );
      } catch (err) {
        console.warn('Currency detection failed, defaulting to USD', err);
        setCurrency('USD');
        setRate(1);
      } finally {
        setLoading(false);
      }
    }

    detectCurrency();
  }, []);

  // Prices are stored in the database as USD cents.
  const formatPrice = (usdCents) => {
    const usdAmount = usdCents / 100;
    const converted = usdAmount * rate;
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
      }).format(converted);
    } catch {
      // Fallback if the detected currency code is somehow invalid
      return `$${usdAmount.toFixed(2)}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, rate, loading, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within a CurrencyProvider');
  return ctx;
}
