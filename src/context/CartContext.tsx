import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Cart = { [cookieId: string]: number };

type CartContextValue = {
  cart: Cart;
  setCart: React.Dispatch<React.SetStateAction<Cart>>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // THE FIX: Initialize state to an empty object, removing the localStorage logic.
  const [cart, setCart] = useState<Cart>({});

  // We have also removed the `useEffect` hook that was saving the cart to localStorage.

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
};
