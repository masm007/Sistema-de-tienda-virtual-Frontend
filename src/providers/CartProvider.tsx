import { createContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "../types/Product";
import { STORAGE_KEYS } from "../constants/storage";

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
  emptyCart: () => void;
};

export const CartContext = createContext<CartContextType | null>(null);

type Props = {
  children: ReactNode;
};

export const CartProvider = ({ children }: Props) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const localCart = localStorage.getItem(STORAGE_KEYS.CART);
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
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number) => {
    if (quantity <= 0) {
      throw new Error("La cantidad debe ser mayor que cero.");
    }
    if (quantity > product.quantity) {
      throw new Error(
        `Solo hay ${product.quantity} unidades disponibles de este producto.`,
      );
    }
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.product.id === product.id,
      );
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > product.quantity) {
          throw new Error(
            `Solo hay ${product.quantity} unidades disponibles de este producto.`,
          );
        }

        return currentCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQuantity }
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
    const existingItem = cart.find((item) => item.product.id === id);
    if (!existingItem) {
      return;
    }
    if (quantity <= 0) {
      deleteProduct(id);
      return;
    }
    if (quantity > existingItem.product.quantity) {
      return;
    }
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.product.id === id ? { ...item, quantity } : item,
      ),
    );
  };

  const emptyCart = () => {
    setCart([]);
  }

  return (
    <>
      {/* */}
      <CartContext.Provider
        value={{ cart, addToCart, getSubtotal, deleteProduct, changeQuantity, emptyCart }}
      >
        {children}
      </CartContext.Provider>
    </>
  );
};
