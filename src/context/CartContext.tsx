"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: number | null;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size?: number | null) => void;
  updateQuantity: (id: string, size: number | null | undefined, delta: number) => void;
  updateSize: (id: string, oldSize: number | null | undefined, newSize: number) => void;
  clearCart: () => void;
  cartTotal: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (newItem: CartItem) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === newItem.id && i.size === newItem.size);
      if (existing) {
        return prev.map(i =>
          i.id === newItem.id && i.size === newItem.size
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string, size?: number | null) => {
    setCartItems(prev => prev.filter(i => !(i.id === id && i.size === size)));
  };

  const updateQuantity = (id: string, size: number | null | undefined, delta: number) => {
    setCartItems(prev =>
      prev
        .map(i =>
          i.id === id && i.size === size
            ? { ...i, quantity: Math.max(1, i.quantity + delta) }
            : i
        )
        .filter(i => i.quantity > 0)
    );
  };

  const updateSize = (id: string, oldSize: number | null | undefined, newSize: number) => {
    setCartItems(prev => {
      const target = prev.find(i => i.id === id && i.size === oldSize);
      if (!target) return prev;
      const duplicate = prev.find(i => i.id === id && i.size === newSize);
      if (duplicate) {
        return prev
          .filter(i => !(i.id === id && i.size === oldSize))
          .map(i =>
            i.id === id && i.size === newSize
              ? { ...i, quantity: i.quantity + target.quantity }
              : i
          );
      }
      return prev.map(i =>
        i.id === id && i.size === oldSize ? { ...i, size: newSize } : i
      );
    });
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateSize,
        clearCart,
        cartTotal,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart, CartProvider içinde kullanılmalıdır");
  return ctx;
}
