import { createContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "../types/Product";

const CART_STORAGE_KEY = "cart";

type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  getSubtotal: () => number;
  deleteProduct: (id: number) => void;
  changeQuantity: (id: number, quantity: number) => void;
};

export const CartContext = createContext<CartContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const CartProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const localCart = localStorage.getItem("cart");
    return localCart ? JSON.parse(localCart) : [];
  });

  {
    /*   useEffect(() => {
    const localCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!localCart) {
      return;
    } else {
      const cart = JSON.parse(localCart);
      setCart(cart);
    }
  }, []);*/
  }

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

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
      return [...currentCart, { product, quantity }];
    });
  };

  const getSubtotal = () => {
    var subtotal = 0.0;
    cart.forEach((c) => {
      subtotal += c.product.price * c.quantity;
    });
    return subtotal;
  };

  const deleteProduct = (id: number) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.product.id !== id),
    );
  };

  const changeQuantity = (id: number, quantity: number) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.product.id === id ? { ...item, quantity } : item,
      ),
    );
  };

  return (
    <>
      {/* */}
      <CartContext.Provider
        value={{ cart, addToCart, getSubtotal, deleteProduct, changeQuantity }}
      >
        {children}
      </CartContext.Provider>
    </>
  );
};
