import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Attach Authorization header if token exists in localStorage (as fallback to httpOnly cookies)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("dealbridge_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login or health checks
      const isAuthCheck = error.config.url.includes("/auth/me");
      if (isAuthCheck) {
        localStorage.removeItem("dealbridge_token");
        localStorage.removeItem("dealbridge_user");
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (userData) => {
    const res = await API.post("/auth/register", userData);
    if (res.data.token) {
      localStorage.setItem("dealbridge_token", res.data.token);
      localStorage.setItem("dealbridge_user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  login: async (credentials) => {
    const res = await API.post("/auth/login", credentials);
    if (res.data.token) {
      localStorage.setItem("dealbridge_token", res.data.token);
      localStorage.setItem("dealbridge_user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  logout: async () => {
    try {
      await API.post("/auth/logout");
    } finally {
      localStorage.removeItem("dealbridge_token");
      localStorage.removeItem("dealbridge_user");
    }
  },

  getMe: async () => {
    const res = await API.get("/auth/me");
    if (res.data.user) {
      localStorage.setItem("dealbridge_user", JSON.stringify(res.data.user));
    }
    return res.data;
  },

  updateProfile: async (profileData) => {
    const res = await API.put("/auth/profile", profileData);
    if (res.data.user) {
      localStorage.setItem("dealbridge_user", JSON.stringify(res.data.user));
    }
    return res.data;
  },
};

export const healthAPI = {
  getHealth: async () => {
    const start = performance.now();
    const res = await API.get("/health");
    const end = performance.now();
    return {
      ...res.data,
      latencyMs: Math.round(end - start),
    };
  },
};

export const productAPI = {
  getProducts: async (params = {}) => {
    const res = await API.get("/products", { params });
    return res.data;
  },

  getProduct: async (idOrSlug) => {
    const res = await API.get(`/products/${idOrSlug}`);
    return res.data;
  },

  getProductOffers: async (productId) => {
    const res = await API.get(`/products/${productId}/offers`);
    return res.data;
  },

  getCategories: async () => {
    const res = await API.get("/products/categories");
    return res.data;
  },

  getRedirectUrl: (offerId) => {
    const rawBase = import.meta.env.VITE_API_URL;
    if (rawBase) {
      const base = rawBase.endsWith("/api") ? rawBase : `${rawBase.replace(/\/+$/, "")}/api`;
      return `${base}/redirect/${offerId}`;
    }
    return `/api/redirect/${offerId}`;
  },
};

export const wishlistAPI = {
  getWishlist: async () => {
    const res = await API.get("/wishlist");
    return res.data;
  },

  getWishlistIds: async () => {
    const res = await API.get("/wishlist/ids");
    return res.data;
  },

  addToWishlist: async (productId) => {
    const res = await API.post(`/wishlist/${productId}`);
    return res.data;
  },

  removeFromWishlist: async (productId) => {
    const res = await API.delete(`/wishlist/${productId}`);
    return res.data;
  },

  clearWishlist: async () => {
    const res = await API.delete("/wishlist");
    return res.data;
  },
};

export const adminAPI = {
  getStats: async () => {
    const res = await API.get("/admin/stats");
    return res.data;
  },

  getAnalytics: async () => {
    const res = await API.get("/admin/analytics");
    return res.data;
  },

  getMerchants: async () => {
    const res = await API.get("/admin/merchants");
    return res.data;
  },

  createProduct: async (productData) => {
    const res = await API.post("/products", productData);
    return res.data;
  },

  updateProduct: async (id, productData) => {
    const res = await API.put(`/products/${id}`, productData);
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await API.delete(`/products/${id}`);
    return res.data;
  },

  toggleAvailability: async (id) => {
    const res = await API.patch(`/products/${id}/availability`);
    return res.data;
  },

  addOffer: async (productId, offerData) => {
    const res = await API.post(`/products/${productId}/offers`, offerData);
    return res.data;
  },

  updateOffer: async (offerId, offerData) => {
    const res = await API.put(`/offers/${offerId}`, offerData);
    return res.data;
  },

  deleteOffer: async (offerId) => {
    const res = await API.delete(`/offers/${offerId}`);
    return res.data;
  },
};

export default API;
