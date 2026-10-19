import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem("dealbridge_user");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check current session from backend on mount
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authAPI.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      // 401 is normal when not logged in
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await authAPI.login({ email, password });
      if (res.success) {
        setUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || "Login failed" };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "An error occurred during login";
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await authAPI.register(userData);
      if (res.success) {
        setUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || "Registration failed" };
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        err.message ||
        "An error occurred during registration";
      setError(message);
      return {
        success: false,
        message,
        errors: err.response?.data?.errors,
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    setError(null);
    try {
      const res = await authAPI.updateProfile(profileData);
      if (res.success) {
        setUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || "Profile update failed" };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to update profile";
      setError(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    refreshUser: checkAuth,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
