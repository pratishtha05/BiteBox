import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

import api from "../utils/api";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();

  const [cart, setCart] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [loading, setLoading] = useState(false);

  const authHeaders = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

  // Fetch cart on login
  useEffect(() => {
    if (!isAuthenticated || !token) {
      setCart([]);
      setRestaurantId(null);
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);

        const res = await api.get("/cart", authHeaders);

        setCart(res.data?.items || []);
        setRestaurantId(res.data?.restaurantId || null);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated, token]);

  // Persist cart
  const persistCart = async (items, restId) => {
    try {
      await api.post("/cart", { items, restaurantId: restId }, authHeaders);
    } catch (err) {
      console.error("Failed to save cart:", err);
    }
  };

  // Add item
  const addToCart = (item, restId) => {
    if (restaurantId && restaurantId !== restId) {
      throw new Error("SINGLE_RESTAURANT_ONLY");
    }

    const updatedCart = (() => {
      const existing = cart.find((i) => i.menuItem === item.menuItem);

      if (existing) {
        return cart.map((i) =>
          i.menuItem === item.menuItem
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...cart, { ...item, quantity: 1 }];
    })();

    setCart(updatedCart);
    setRestaurantId(restId);
    persistCart(updatedCart, restId);
  };

  // Update quantity
  const updateQty = (menuItem, quantity) => {
    const updatedCart = cart.map((i) =>
      i.menuItem === menuItem ? { ...i, quantity } : i
    );

    setCart(updatedCart);
    persistCart(updatedCart, restaurantId);
  };

  // Remove item
  const removeItem = (menuItem) => {
    const updatedCart = cart.filter((i) => i.menuItem !== menuItem);
    const newRestaurantId = updatedCart.length ? restaurantId : null;

    setCart(updatedCart);
    setRestaurantId(newRestaurantId);
    persistCart(updatedCart, newRestaurantId);
  };

  // Clear cart
  const clearCart = async () => {
    try {
      await api.delete("/cart", authHeaders);
    } catch (err) {
      console.error("Failed to clear cart:", err);
    } finally {
      setCart([]);
      setRestaurantId(null);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        restaurantId,
        loading,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
