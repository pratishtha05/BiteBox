import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [admin, setAdmin] = useState(null);

  const [loading, setLoading] = useState(true);

  // Load auth data from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedRole) {
      setToken(storedToken);
      setRole(storedRole);

      if (storedRole === "user") {
        setUser(JSON.parse(localStorage.getItem("user")));
      }
      if (storedRole === "restaurant") {
        setRestaurant(JSON.parse(localStorage.getItem("restaurant")));
      }
      if (storedRole === "admin") {
        setAdmin(JSON.parse(localStorage.getItem("admin")));
      }
    }

    setLoading(false);
  }, []);

  // Login handler
  const login = async (role, payload) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/auth/${role}/login`,
        payload
      );

      const { token, user, restaurant, admin } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      setToken(token);
      setRole(role);

      if (role === "user") {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      }

      if (role === "restaurant") {
        localStorage.setItem("restaurant", JSON.stringify(restaurant));
        setRestaurant(restaurant);
      }

      if (role === "admin") {
        localStorage.setItem("admin", JSON.stringify(admin));
        setAdmin(admin);
      }

      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0]?.msg ||
          "Login failed"
      );
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.clear();

    setToken(null);
    setRole(null);
    setUser(null);
    setRestaurant(null);
    setAdmin(null);
  };

  // Signup handler
  const signup = async (role, payload) => {
    if (role === "admin") throw new Error("Admin cannot signup");

    try {
      const res = await axios.post(
        `http://localhost:3000/auth/${role}/signup`,
        payload
      );

      // Automatically log in the user after signup
      login({ ...res.data, role });

      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.message || err.message || "Signup failed"
      );
    }
  };

  // Helpers
  const isAuthenticated = !!token;

  const hasRole = (allowedRoles) => {
    if (!role) return false;
    return Array.isArray(allowedRoles)
      ? allowedRoles.includes(role)
      : role === allowedRoles;
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        user,
        restaurant,
        admin,
        isAuthenticated,
        loading,
        login,
        logout,
        signup,
        hasRole,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
