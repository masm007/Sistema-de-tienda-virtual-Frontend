import { createContext, useState, type ReactNode } from "react";
import type { Product } from "../types/Product";

type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  getSubtotal: () => number;
};

export const CartContext = createContext<CartContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const CartProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.product.id === product.id,
      );
      if (existingItem) {
        return currentCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...currentCart, { product, quantity}];
    });
  };

  const getSubtotal = () => {
    var subtotal = 0.0;
    cart.forEach((c) => {
      subtotal += c.product.price * c.quantity;
    });
    return subtotal;
  };

  return (
    <>
      {/* */}
      <CartContext.Provider value={{ cart, addToCart, getSubtotal }}>
        {children}
      </CartContext.Provider>
    </>
  );
};
