import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:3000/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data.items || []);
        setRestaurantId(res.data.restaurantId || null);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchCart();
  }, [isAuthenticated, token]);

  const saveCart = async (updatedCart, updatedRestaurantId) => {
    try {
      await axios.post(
        "http://localhost:3000/cart",
        { items: updatedCart, restaurantId: updatedRestaurantId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to save cart:", err.response?.data || err.message);
    }
  };

  const addToCart = (item, restId) => {
    setCart((prev) => {
      if (restaurantId && restaurantId !== restId) {
        alert("You can order from only one restaurant at a time");
        return prev;
      }

      const existing = prev.find((i) => i.menuItem === item.menuItem);
      let updatedCart;

      if (existing) {
        updatedCart = prev.map((i) =>
          i.menuItem === item.menuItem
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        updatedCart = [...prev, { ...item, quantity: 1 }];
      }

      setRestaurantId(restId);
      saveCart(updatedCart, restId);
      return updatedCart;
    });
  };

  const updateQty = (menuItem, qty) => {
    setCart((prev) => {
      const updatedCart = prev.map((i) =>
        i.menuItem === menuItem ? { ...i, quantity: qty } : i
      );
      saveCart(updatedCart, restaurantId);
      return updatedCart;
    });
  };

  const removeItem = (menuItem) => {
    setCart((prev) => {
      const updatedCart = prev.filter((i) => i.menuItem !== menuItem);
      if (updatedCart.length === 0) setRestaurantId(null);
      saveCart(updatedCart, updatedCart.length ? restaurantId : null);
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    setRestaurantId(null);
    axios.delete("http://localhost:3000/cart", {
      headers: { Authorization: `Bearer ${token}` },
    }).catch((err) => console.error(err));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, restaurantId, updateQty, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
