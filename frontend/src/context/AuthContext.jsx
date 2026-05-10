import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync state with LocalStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);

      try {
        const storedData = JSON.parse(localStorage.getItem(storedRole));
        if (storedRole === "user") setUser(storedData);
        if (storedRole === "restaurant") setRestaurant(storedData);
        if (storedRole === "admin") setAdmin(storedData);
        if (storedRole === "delivery") setDelivery(storedData);
      } catch (e) {
        console.error("Error parsing stored auth data", e);
        logout(); // Clear corrupted data
      }
    }
    setLoading(false);
  }, []);

  const login = async (role, payload) => {
    try {
      const res = await api.post(`/auth/${role}/login`, payload);
      
     
      const { token, user, restaurant, admin, delivery } = res.data.data;

      // Handle Blocked Status
      const account = user || restaurant || delivery;
      if (account?.isBlocked) {
        throw new Error(`${role.charAt(0).toUpperCase() + role.slice(1)} is blocked: ${account.blockReason || "No reason provided"}`);
      }

      // Persist to LocalStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      
      setToken(token);
      setRole(role);

      // Map roles to state and storage
      if (role === "user") {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      } else if (role === "restaurant") {
        localStorage.setItem("restaurant", JSON.stringify(restaurant));
        setRestaurant(restaurant);
      } else if (role === "admin") {
        localStorage.setItem("admin", JSON.stringify(admin));
        setAdmin(admin);
      } else if (role === "delivery") {
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

  const signup = async (role, payload) => {
    try {
      const config = role === "restaurant" 
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};

      const res = await api.post(`/auth/${role}/signup`, payload, config);

      // Automatically login after successful signup
      let loginPayload;
      if (role === "restaurant") {
        loginPayload = {
          email: payload.get("email"),
          password: payload.get("password"),
        };
      } else {
        loginPayload = {
          email: payload.email,
          password: payload.password,
        };
      }

      await login(role, loginPayload);
      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message || 
        err.message || 
        "Signup failed"
      );
    }
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUser(null);
    setRestaurant(null);
    setAdmin(null);
    setDelivery(null);
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