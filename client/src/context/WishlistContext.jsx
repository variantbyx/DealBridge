import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { wishlistAPI } from "../services/api.js";
import { useAuth } from "./AuthContext.jsx";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch wishlist from backend when authenticated
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      setWishlistIds(new Set());
      return;
    }

    setLoading(true);
    try {
      const data = await wishlistAPI.getWishlist();
      if (data.success) {
        const items = data.wishlist || [];
        setWishlist(items);
        setWishlistIds(new Set(items.map((p) => (p.id || p._id).toString())));
      }
    } catch (err) {
      console.warn("Failed to fetch wishlist:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist, user]);

  const isInWishlist = useCallback(
    (productId) => {
      if (!productId) return false;
      return wishlistIds.has(productId.toString());
    },
    [wishlistIds]
  );

  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      return { success: false, requireAuth: true, message: "Please sign in to save products" };
    }

    try {
      const idStr = typeof productId === "object" ? (productId.id || productId._id) : productId;
      const data = await wishlistAPI.addToWishlist(idStr);
      if (data.success) {
        const items = data.wishlist || [];
        setWishlist(items);
        setWishlistIds(new Set(items.map((p) => (p.id || p._id).toString())));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Failed to add to wishlist",
      };
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return { success: false };

    try {
      const idStr = typeof productId === "object" ? (productId.id || productId._id) : productId;
      const data = await wishlistAPI.removeFromWishlist(idStr);
      if (data.success) {
        const items = data.wishlist || [];
        setWishlist(items);
        setWishlistIds(new Set(items.map((p) => (p.id || p._id).toString())));
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || "Failed to remove from wishlist",
      };
    }
  };

  const toggleWishlist = async (productOrId) => {
    const id = typeof productOrId === "object" ? (productOrId.id || productOrId._id) : productOrId;
    if (isInWishlist(id)) {
      return await removeFromWishlist(id);
    } else {
      return await addToWishlist(id);
    }
  };

  const clearWishlist = async () => {
    if (!isAuthenticated) return { success: false };
    try {
      await wishlistAPI.clearWishlist();
      setWishlist([]);
      setWishlistIds(new Set());
      return { success: true };
    } catch (err) {
      console.warn("Failed to clear wishlist:", err);
      return { success: false, message: err.message };
    }
  };

  const value = {
    wishlist,
    wishlistCount: wishlist.length,
    loading,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    refreshWishlist: fetchWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
