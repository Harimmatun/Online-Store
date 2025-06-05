import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/header';
import Catalog from './components/catalog';
import Cart from './components/cart';
import Checkout from './components/checkout';
import Profile from './components/profile';
import Register from './components/register';
import Login from './components/login';
import ResetPassword from './components/resetPassword';
import Compare from './components/compare';
import ProductPage from './components/product';
import CartPopup from './components/CartPopup';
import ProtectedRoute from './components/ProtectedRoute';
import { SearchProvider } from './context/SearchContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Інтерфейс для продукту
interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  return (
    <AuthProvider>
      <SearchProvider>
        <CartProvider>
          <Router>
            <div>
              <Header />
              <Routes>
                <Route path="/" element={<Catalog />} />
                <Route path="/product/:id" element={<ProductPage products={products} />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/compare" element={<Compare />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Profile />} />
                </Route>
              </Routes>
              <CartPopup />
            </div>
          </Router>
        </CartProvider>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;