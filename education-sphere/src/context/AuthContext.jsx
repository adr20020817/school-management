// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { message } from "antd";

// Create context
const AuthContext = createContext();

// Custom hook
export const useAuth = () => useContext(AuthContext);

// AuthProvider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load logged-in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("schoolUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Persist logged-in user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("schoolUser", JSON.stringify(user));
    else localStorage.removeItem("schoolUser");
  }, [user]);

  // Login function
  const login = async ({ email, password, role }) => {
    setLoading(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        // Get registered users from localStorage
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        // Find user with matching email, password, and role
        const found = users.find(
          (u) => u.email === email && u.password === password && u.role === role
        );

        if (found) {
          setUser(found);
          message.success(`Welcome, ${found.name}`);
          resolve(true);
        } else {
          message.error("Invalid credentials or role");
          resolve(false);
        }

        setLoading(false);
      }, 1000);
    });
  };

  // Register function
  const register = async ({ name, email, password, role }) => {
    setLoading(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        // Load users from localStorage
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        // Check if email is already registered
        if (users.some((u) => u.email === email)) {
          message.error("Email already registered");
          setLoading(false);
          resolve(false);
          return;
        }

        // Create new user
        const newUser = {
          id: Date.now().toString(), // unique ID for dashboard mapping
          name,
          email,
          password,
          role,
        };

        // Save to localStorage
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        // Set user in context
        setUser(newUser);
        message.success("Account created successfully!");
        setLoading(false);
        resolve(true);
      }, 1000);
    });
  };

  // Logout
  const logout = () => {
    setUser(null);
    message.info("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
