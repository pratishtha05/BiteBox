import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [delivery, setDelivery] = useState(null); // ✅ Delivery partner state

  const [loading, setLoading] = useState(true);

  // ---------------- LOAD FROM LOCALSTORAGE ----------------
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);

      if (storedRole === "user") {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser({
          ...storedUser,
          isBlocked: storedUser?.isBlocked || false,
          blockReason: storedUser?.blockReason || "",
        });
      }

      if (storedRole === "restaurant") {
        const storedRestaurant = JSON.parse(localStorage.getItem("restaurant"));
        setRestaurant({
          ...storedRestaurant,
          isBlocked: storedRestaurant?.isBlocked || false,
          blockReason: storedRestaurant?.blockReason || "",
        });
      }

      if (storedRole === "admin") {
        setAdmin(JSON.parse(localStorage.getItem("admin")));
      }

      if (storedRole === "delivery") {
        const storedDelivery = JSON.parse(localStorage.getItem("delivery"));
        setDelivery(storedDelivery);
      }
    }

    setLoading(false);
  }, []);

  // ---------------- LOGIN ----------------
  const login = async (role, payload) => {
    try {
      const res = await axios.post(`http://localhost:3000/auth/${role}/login`, payload);
      const { token, user, restaurant, admin, delivery } = res.data;

      // Blocked checks
      if (role === "restaurant" && restaurant?.isBlocked) {
        throw new Error(`Restaurant is blocked: ${restaurant.blockReason}`);
      }

      if (role === "user" && user?.isBlocked) {
        throw new Error(`Your account is blocked: ${user.blockReason}`);
      }

      if (role === "delivery" && delivery?.isBlocked) {
        throw new Error(`Delivery partner is blocked`);
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setToken(token);
      setRole(role);

      if (role === "user" && user) {
        const newUser = { ...user, isBlocked: user?.isBlocked || false, blockReason: user?.blockReason || "" };
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
      }

      if (role === "restaurant" && restaurant) {
        const newRestaurant = { ...restaurant, isBlocked: restaurant?.isBlocked || false, blockReason: restaurant?.blockReason || "" };
        localStorage.setItem("restaurant", JSON.stringify(newRestaurant));
        setRestaurant(newRestaurant);
      }

      if (role === "admin" && admin) {
        localStorage.setItem("admin", JSON.stringify(admin));
        setAdmin(admin);
      }

      if (role === "delivery" && delivery) {
        localStorage.setItem("delivery", JSON.stringify(delivery));
        setDelivery(delivery);
      }

      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        err.message ||
        "Login failed"
      );
    }
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUser(null);
    setRestaurant(null);
    setAdmin(null);
    setDelivery(null);
  };

  // ---------------- SIGNUP ----------------
  const signup = async (role, payload) => {
    if (role === "admin") throw new Error("Admin cannot signup");

    try {
      const res = await axios.post(`http://localhost:3000/auth/${role}/signup`, payload);
      // Auto login after signup
      await login(role, payload);
      return res.data;
    } catch (err) {
      throw new Error(err?.response?.data?.message || err.message || "Signup failed");
    }
  };

  const isAuthenticated = !!token;
  const hasRole = (allowedRoles) => {
    if (!role) return false;
    return Array.isArray(allowedRoles) ? allowedRoles.includes(role) : role === allowedRoles;
  };

  return (
    <AuthContext.Provider value={{
      token, role, user, restaurant, admin, delivery,
      isAuthenticated, loading, login, logout, signup, hasRole
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
