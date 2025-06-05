import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    console.log('Adding item to cart:', item);
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        const newItems = prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
        console.log('Updated existing item, new cart:', newItems);
        return newItems;
      }
      const newItems = [...prevItems, item];
      console.log('Added new item, new cart:', newItems);
      return newItems;
    });
  };

  const removeFromCart = (id: string) => {
    console.log('Removing item with id:', id);
    setCartItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== id);
      console.log('New cart after removal:', newItems);
      return newItems;
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    console.log('Updating quantity for id:', id, 'to:', quantity);
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === id ? { ...item, quantity: quantity } : item
      );
      console.log('New cart after quantity update:', newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    console.log('Clearing cart');
    setCartItems([]);
  };

  console.log('Current cart items in provider:', cartItems);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}