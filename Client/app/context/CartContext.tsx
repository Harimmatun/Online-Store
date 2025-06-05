import { createContext, useContext, useState, useEffect } from 'react';

// Інтерфейс для продукту в кошику
interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

// Інтерфейс для контексту кошика
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: { id: string; title: string; price: number }) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  // Ініціалізація стану кошика з localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Збереження кошика в localStorage при кожній зміні
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: { id: string; title: string; price: number }) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);