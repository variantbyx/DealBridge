import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { productAPI, adminAPI } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { ProductModal } from "../components/admin/ProductModal.jsx";
import { OffersModal } from "../components/admin/OffersModal.jsx";
import {
  Shield,
  Layers,
  ShoppingBag,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Activity,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Tag,
  CheckCircle2,
  Clock,
  Sparkles,
  Store,
  Smartphone,
  Laptop,
} from "lucide-react";

export const AdminDashboardPage = ({ initialTab = "catalog" }) => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(
    queryTab === "analytics" || initialTab === "analytics" ? "analytics" : "catalog"
  );
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    if (queryTab && (queryTab === "catalog" || queryTab === "analytics")) {
      setActiveTab(queryTab);
    }
  }, [queryTab]);

  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Search and filter state
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState(null);
  const [offersModalOpen, setOffersModalOpen] = useState(false);
  const [selectedProductForOffers, setSelectedProductForOffers] = useState(null);

  // Load products list
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productAPI.getProducts({
        search: search.trim() || undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        limit: 50,
      });
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter]);

  // Load analytics and statistics
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await adminAPI.getStats();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    if (activeTab === "analytics") {
      loadStats();
    }
  }, [activeTab, loadStats]);

  const formatPrice = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleToggleAvailability = async (productId) => {
    try {
      const res = await adminAPI.toggleAvailability(productId);
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) =>
            (p.id || p._id) === productId ? { ...p, isAvailable: res.isAvailable } : p
          )
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to toggle product status");
    }
  };

  const handleDeleteProduct = async (productId, name) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}" and all its merchant offers?`)) {
      try {
        const res = await adminAPI.deleteProduct(productId);
        if (res.success) {
          setProducts((prev) => prev.filter((p) => (p.id || p._id) !== productId));
        }
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete product");
      }
    }
  };

  const openNewProductModal = () => {
    setSelectedProductForEdit(null);
    setProductModalOpen(true);
  };

  const openEditProductModal = (product) => {
    setSelectedProductForEdit(product);
    setProductModalOpen(true);
  };

  const openOffersModal = (product) => {
    setSelectedProductForOffers(product);
    setOffersModalOpen(true);
  };

  return (
    <div style={{ padding: "2.5rem 0 6rem" }}>
      <div className="container">
        {/* Top Header Banner */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span className="badge badge-purple" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <Shield size={12} /> Module 5: Admin Operations
              </span>
              <span className="badge badge-emerald">Master Console</span>
            </div>
            <h1 style={{ fontSize: "2.25rem", lineHeight: 1.2 }}>
              Catalog &amp; Offer Administration
            </h1>
            <p style={{ marginTop: "0.35rem", fontSize: "0.95rem", color: "var(--text-muted)", maxWidth: "680px" }}>
              Standardize canonical products, associate real-time merchant offers, and monitor
              outbound affiliate conversion tracking telemetry.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={openNewProductModal}
              className="btn btn-primary"
              style={{ boxShadow: "0 4px 15px rgba(16, 185, 129, 0.35)" }}
            >
              <Plus size={16} /> New Canonical Product
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            borderBottom: "1px solid var(--border-subtle)",
            marginBottom: "2rem",
          }}
        >
          <button
            type="button"
            onClick={() => switchTab("catalog")}
            style={{
              padding: "0.75rem 1.25rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "catalog" ? "2px solid var(--accent-emerald)" : "2px solid transparent",
              color: activeTab === "catalog" ? "#fff" : "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all var(--transition-fast)",
            }}
          >
            <Layers size={16} style={{ color: activeTab === "catalog" ? "var(--accent-emerald)" : "currentColor" }} />
            Catalog &amp; Offer Governance
          </button>

          <button
            type="button"
            onClick={() => switchTab("analytics")}
            style={{
              padding: "0.75rem 1.25rem",
              fontSize: "0.95rem",
              fontWeight: 600,
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "analytics" ? "2px solid var(--accent-cyan)" : "2px solid transparent",
              color: activeTab === "analytics" ? "#fff" : "var(--text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all var(--transition-fast)",
            }}
          >
            <BarChart3 size={16} style={{ color: activeTab === "analytics" ? "var(--accent-cyan)" : "currentColor" }} />
            Click Telemetry &amp; System Analytics
          </button>
        </div>

        {/* TAB 1: CATALOG MANAGEMENT */}
        {activeTab === "catalog" && (
          <div>
            {/* Filter & Search Bar */}
            <div
              className="glass-card"
              style={{
                padding: "1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
                marginBottom: "1.5rem",
                background: "rgba(12, 18, 32, 0.7)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: "1 1 300px" }}>
                <div style={{ position: "relative", width: "100%", maxWidth: "380px" }}>
                  <Search
                    size={16}
                    style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, brand, model number..."
                    className="input"
                    style={{ paddingLeft: "2.5rem", fontSize: "0.85rem" }}
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="input"
                  style={{ width: "180px", background: "#0a101d", fontSize: "0.85rem" }}
                >
                  <option value="all">All Categories</option>
                  <option value="watches">Watches</option>
                  <option value="smartphones">Smartphones</option>
                  <option value="laptops">Laptops</option>
                  <option value="headphones">Headphones</option>
                  <option value="fashion">Fashion</option>
                  <option value="home-appliances">Home Appliances</option>
                </select>
              </div>

              <div style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
                Showing <strong>{products.length}</strong> canonical items
              </div>
            </div>

            {/* Products Table */}
            {loading ? (
              <div style={{ padding: "4rem 0", textAlign: "center", color: "var(--text-secondary)" }}>
                <RefreshCw size={32} className="animate-spin" style={{ color: "var(--accent-emerald)", margin: "0 auto 1rem" }} />
                <div>Loading catalog specifications...</div>
              </div>
            ) : products.length === 0 ? (
              <div
                className="glass-card"
                style={{
                  padding: "4rem 2rem",
                  textAlign: "center",
                  borderRadius: "1rem",
                  border: "1px dashed var(--border-medium)",
                }}
              >
                <ShoppingBag size={40} style={{ color: "var(--text-muted)", margin: "0 auto 1rem" }} />
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No Canonical Products Found</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                  Try adjusting your search query or add a brand-new canonical product.
                </p>
                <button type="button" onClick={openNewProductModal} className="btn btn-primary">
                  <Plus size={16} /> Add Product
                </button>
              </div>
            ) : (
              <div
                className="glass-card"
                style={{
                  overflowX: "auto",
                  background: "rgba(10, 16, 28, 0.8)",
                  borderRadius: "0.75rem",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.02)" }}>
                      <th style={{ padding: "1rem 1.25rem", color: "var(--text-muted)", fontWeight: 600 }}>Product &amp; Canonical Key</th>
                      <th style={{ padding: "1rem 1.25rem", color: "var(--text-muted)", fontWeight: 600 }}>Category</th>
                      <th style={{ padding: "1rem 1.25rem", color: "var(--text-muted)", fontWeight: 600 }}>Status</th>
                      <th style={{ padding: "1rem 1.25rem", color: "var(--text-muted)", fontWeight: 600 }}>Best Offer Price</th>
                      <th style={{ padding: "1rem 1.25rem", color: "var(--text-muted)", fontWeight: 600 }}>Stores</th>
                      <th style={{ padding: "1rem 1.25rem", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      const productId = p.id || p._id;
                      return (
                        <tr
                          key={productId}
                          style={{
                            borderBottom: "1px solid var(--border-subtle)",
                            transition: "background var(--transition-fast)",
                          }}
                        >
                          {/* Product Info */}
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                              <img
                                src={p.thumbnail || (p.images && p.images[0]) || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"}
                                alt={p.name}
                                style={{
                                  width: "48px",
                                  height: "48px",
                                  borderRadius: "6px",
                                  objectFit: "cover",
                                  background: "#080e1c",
                                  flexShrink: 0,
                                }}
                              />
                              <div>
                                <div style={{ fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
                                  {p.name}
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                                  Brand: <strong style={{ color: "var(--text-secondary)" }}>{p.brand}</strong> · Model: <code style={{ color: "#38bdf8" }}>{p.modelNumber}</code>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <span className="badge badge-blue" style={{ fontSize: "0.7rem", textTransform: "capitalize" }}>
                              {p.category?.replace("-", " ")}
                            </span>
                          </td>

                          {/* Availability Toggle */}
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <button
                              type="button"
                              onClick={() => handleToggleAvailability(productId)}
                              className={`badge ${p.isAvailable ? "badge-emerald" : "badge-gray"}`}
                              style={{
                                cursor: "pointer",
                                border: "none",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3rem",
                              }}
                              title="Click to toggle product availability"
                            >
                              {p.isAvailable ? <Eye size={12} /> : <EyeOff size={12} />}
                              {p.isAvailable ? "Active" : "Deactivated"}
                            </button>
                          </td>

                          {/* Lowest Price */}
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <div style={{ fontWeight: 800, color: p.lowestPrice > 0 ? "var(--accent-emerald)" : "var(--text-muted)", fontSize: "1rem" }}>
                              {p.lowestPrice > 0 ? formatPrice(p.lowestPrice) : "No Offers"}
                            </div>
                          </td>

                          {/* Offer Count */}
                          <td style={{ padding: "1rem 1.25rem" }}>
                            <span className="badge badge-purple" style={{ fontSize: "0.75rem" }}>
                              {p.offerCount || 0} {p.offerCount === 1 ? "store" : "stores"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                              <button
                                type="button"
                                onClick={() => openOffersModal(p)}
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: "0.775rem", padding: "0.35rem 0.65rem" }}
                                title="Manage Merchant Offers"
                              >
                                <Store size={13} /> Offers
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditProductModal(p)}
                                className="btn btn-ghost btn-sm"
                                style={{ padding: "0.35rem 0.5rem", color: "var(--accent-cyan)" }}
                                title="Edit Product"
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteProduct(productId, p.name)}
                                className="btn btn-ghost btn-sm"
                                style={{ padding: "0.35rem 0.5rem", color: "#f87171" }}
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CLICK TELEMETRY & SYSTEM ANALYTICS */}
        {activeTab === "analytics" && (
          <div>
            {statsLoading || !stats ? (
              <div style={{ padding: "4rem 0", textAlign: "center", color: "var(--text-secondary)" }}>
                <RefreshCw size={32} className="animate-spin" style={{ color: "var(--accent-cyan)", margin: "0 auto 1rem" }} />
                <div>Computing stored application telemetry and click events...</div>
              </div>
            ) : (
              <>
                {/* Top Telemetry Status Bar */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1.5rem",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span className="status-dot status-dot-green" />
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                      Live Aggregation from MongoDB ClickEvents
                    </span>
                    <span className="badge badge-emerald" style={{ fontSize: "0.65rem" }}>
                      Active Telemetry
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={loadStats}
                    disabled={statsLoading}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: "0.4rem" }}
                  >
                    <RefreshCw size={14} className={statsLoading ? "animate-spin" : ""} />
                    {statsLoading ? "Refreshing..." : "Refresh Telemetry"}
                  </button>
                </div>

                {/* 4 Top KPI Cards */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1.25rem",
                    marginBottom: "2.5rem",
                  }}
                >
                  <div
                    className="glass-card"
                    style={{
                      padding: "1.25rem 1.5rem",
                      background: "rgba(14, 22, 38, 0.7)",
                      borderLeft: "4px solid var(--accent-emerald)",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                      Canonical Products
                    </div>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", marginTop: "0.25rem" }}>
                      {stats.totalProducts}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--accent-emerald)", marginTop: "0.25rem" }}>
                      {stats.activeProducts} currently active in catalog
                    </div>
                  </div>

                  <div
                    className="glass-card"
                    style={{
                      padding: "1.25rem 1.5rem",
                      background: "rgba(14, 22, 38, 0.7)",
                      borderLeft: "4px solid var(--accent-cyan)",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                      Merchant Offers
                    </div>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent-cyan)", marginTop: "0.25rem" }}>
                      {stats.totalOffers}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                      {stats.activeOffers} in-stock across merchants
                    </div>
                  </div>

                  <div
                    className="glass-card"
                    style={{
                      padding: "1.25rem 1.5rem",
                      background: "rgba(14, 22, 38, 0.7)",
                      borderLeft: "4px solid #f59e0b",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                      Outbound Clicks
                    </div>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f59e0b", marginTop: "0.25rem" }}>
                      {stats.totalClicks}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#34d399", marginTop: "0.25rem" }}>
                      Recorded via /api/redirect telemetry
                    </div>
                  </div>

                  <div
                    className="glass-card"
                    style={{
                      padding: "1.25rem 1.5rem",
                      background: "rgba(14, 22, 38, 0.7)",
                      borderLeft: "4px solid #a855f7",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>
                      Registered Users
                    </div>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "#a855f7", marginTop: "0.25rem" }}>
                      {stats.totalUsers}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                      Buyers, Sellers, Brokers &amp; Admins
                    </div>
                  </div>
                </div>

                {/* 7-Day Outbound Click Trend Chart (Module 6) */}
                {stats.dailyTrend && stats.dailyTrend.length > 0 && (
                  <div
                    className="glass-card"
                    style={{
                      padding: "1.5rem",
                      marginBottom: "2.5rem",
                      background: "rgba(11, 17, 30, 0.8)",
                      borderRadius: "1rem",
                      border: "1px solid var(--border-medium)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "1rem",
                        marginBottom: "1.5rem",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span className="badge badge-cyan" style={{ fontSize: "0.7rem" }}>
                            Dynamic Telemetry Trend
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            Aggregated from MongoDB ClickEvent records
                          </span>
                        </div>
                        <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#fff", marginTop: "0.25rem" }}>
                          Outbound Referral Clicks Over Time (Last 7 Days)
                        </h3>
                      </div>

                      {/* Device Breakdown Pills */}
                      {stats.deviceBreakdown && stats.deviceBreakdown.length > 0 && (
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          {stats.deviceBreakdown.map((dev, idx) => (
                            <span
                              key={idx}
                              className="badge badge-purple"
                              style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem" }}
                            >
                              {dev.device === "Mobile" ? <Smartphone size={12} /> : <Laptop size={12} />}
                              {dev.device}: {dev.count} ({Math.round((dev.count / (stats.totalClicks || 1)) * 100)}%)
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Dynamic Bar Graph */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "1rem",
                        height: "140px",
                        padding: "1rem 0 0.5rem",
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                    >
                      {stats.dailyTrend.map((day, idx) => {
                        const maxClicks = Math.max(...stats.dailyTrend.map((d) => d.clicks), 1);
                        const heightPct = Math.max(14, Math.round((day.clicks / maxClicks) * 100));
                        return (
                          <div
                            key={idx}
                            style={{
                              flex: 1,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              height: "100%",
                              justifyContent: "flex-end",
                            }}
                          >
                            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#38bdf8", marginBottom: "4px" }}>
                              {day.clicks}
                            </div>
                            <div
                              style={{
                                width: "100%",
                                maxWidth: "56px",
                                height: `${heightPct}%`,
                                background: "linear-gradient(180deg, #06b6d4 0%, rgba(6, 182, 212, 0.25) 100%)",
                                borderRadius: "6px 6px 2px 2px",
                                border: "1px solid rgba(6, 182, 212, 0.5)",
                                transition: "all 0.3s ease",
                              }}
                              title={`${day.date}: ${day.clicks} clicks`}
                            />
                            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "6px", fontFamily: "var(--font-mono)" }}>
                              {day.date.slice(5)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2-Column Analytics: Most Clicked Products & Merchants */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                    gap: "1.5rem",
                    marginBottom: "2.5rem",
                  }}
                >
                  {/* Most-Clicked Products */}
                  <div className="glass-card" style={{ padding: "1.5rem", background: "rgba(11, 17, 30, 0.8)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <TrendingUp size={18} style={{ color: "var(--accent-emerald)" }} />
                        Most-Clicked Products
                      </h3>
                      <span className="badge badge-emerald" style={{ fontSize: "0.7rem" }}>Live Ranking</span>
                    </div>

                    {stats.mostClickedProducts && stats.mostClickedProducts.length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {stats.mostClickedProducts.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "0.65rem 0.85rem",
                              borderRadius: "0.5rem",
                              background: "rgba(255, 255, 255, 0.02)",
                              border: "1px solid var(--border-subtle)",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-muted)", width: "20px" }}>
                                #{idx + 1}
                              </span>
                              <img
                                src={item.thumbnail}
                                alt={item.name}
                                style={{ width: "36px", height: "36px", borderRadius: "4px", objectFit: "cover" }}
                              />
                              <div>
                                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
                                  {item.name}
                                </div>
                                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                  {item.brand} · {item.modelNumber}
                                </div>
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              <span className="badge badge-emerald" style={{ fontSize: "0.75rem" }}>
                                {item.clicks} {item.clicks === 1 ? "click" : "clicks"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem 0", fontSize: "0.85rem" }}>
                        No outbound clicks recorded yet. Click "Buy Now" on any product offer to generate telemetry.
                      </div>
                    )}
                  </div>

                  {/* Most-Clicked Merchants */}
                  <div className="glass-card" style={{ padding: "1.5rem", background: "rgba(11, 17, 30, 0.8)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Store size={18} style={{ color: "var(--accent-cyan)" }} />
                        Most-Clicked Merchants
                      </h3>
                      <span className="badge badge-blue" style={{ fontSize: "0.7rem" }}>Affiliate Stores</span>
                    </div>

                    {stats.mostClickedMerchants && stats.mostClickedMerchants.length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {stats.mostClickedMerchants.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "0.65rem 0.85rem",
                              borderRadius: "0.5rem",
                              background: "rgba(255, 255, 255, 0.02)",
                              border: "1px solid var(--border-subtle)",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <span style={{ fontSize: "0.9rem", fontWeight: 800, color: "var(--text-muted)", width: "20px" }}>
                                #{idx + 1}
                              </span>
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "6px",
                                  background: "#fff",
                                  padding: "3px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <img
                                  src={item.logo || "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"}
                                  alt={item.name}
                                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                />
                              </div>
                              <div>
                                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>
                                  {item.name}
                                </div>
                                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                  {item.website}
                                </div>
                              </div>
                            </div>
                            <div>
                              <span className="badge badge-cyan" style={{ fontSize: "0.75rem" }}>
                                {item.clicks} referrals
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem 0", fontSize: "0.85rem" }}>
                        No merchant referrals recorded yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Distribution Bar */}
                {stats.categoryDistribution && stats.categoryDistribution.length > 0 && (
                  <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "2.5rem", background: "rgba(11, 17, 30, 0.8)" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>
                      Catalog Category Breakdown
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
                      {stats.categoryDistribution.map((cat, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: "0.85rem 1rem",
                            borderRadius: "0.5rem",
                            background: "rgba(255, 255, 255, 0.02)",
                            border: "1px solid var(--border-subtle)",
                          }}
                        >
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "capitalize" }}>
                            {cat.category?.replace("-", " ")}
                          </div>
                          <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "#fff", marginTop: "0.2rem" }}>
                            {cat.count} <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "var(--text-muted)" }}>items</span>
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "var(--accent-emerald)", marginTop: "0.2rem" }}>
                            Avg Best: {formatPrice(cat.avgPrice)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Live Recent Outbound Click Events Stream */}
                <div className="glass-card" style={{ padding: "1.5rem", background: "rgba(11, 17, 30, 0.8)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Activity size={18} style={{ color: "var(--accent-cyan)" }} />
                      Recent Outbound Telemetry Stream
                    </h3>
                    <span className="badge badge-purple" style={{ fontSize: "0.7rem" }}>Last 10 ClickEvents</span>
                  </div>

                  {stats.recentClicks && stats.recentClicks.length > 0 ? (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.825rem" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}>
                            <th style={{ padding: "0.6rem" }}>Timestamp</th>
                            <th style={{ padding: "0.6rem" }}>Product</th>
                            <th style={{ padding: "0.6rem" }}>Merchant</th>
                            <th style={{ padding: "0.6rem" }}>User / Session</th>
                            <th style={{ padding: "0.6rem" }}>IP / User Agent</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentClicks.map((c) => (
                            <tr key={c.id || c._id} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                              <td style={{ padding: "0.6rem", color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>
                                {new Date(c.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                              </td>
                              <td style={{ padding: "0.6rem", color: "#fff", fontWeight: 600 }}>
                                {c.product?.name || "Product"}
                              </td>
                              <td style={{ padding: "0.6rem" }}>
                                <span className="badge badge-emerald" style={{ fontSize: "0.675rem" }}>
                                  {c.merchant?.name || "Merchant"}
                                </span>
                              </td>
                              <td style={{ padding: "0.6rem", color: "var(--text-secondary)" }}>
                                {c.user ? c.user.email : "Guest Visitor"}
                              </td>
                              <td style={{ padding: "0.6rem", color: "var(--text-muted)", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
                                {c.ip || "127.0.0.1"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem 0", fontSize: "0.85rem" }}>
                      No click telemetry recorded yet.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Modals */}
        <ProductModal
          isOpen={productModalOpen}
          onClose={() => setProductModalOpen(false)}
          product={selectedProductForEdit}
          onSaved={() => {
            loadProducts();
            if (activeTab === "analytics") loadStats();
          }}
        />

        <OffersModal
          isOpen={offersModalOpen}
          onClose={() => setOffersModalOpen(false)}
          product={selectedProductForOffers}
          onUpdated={() => {
            loadProducts();
            if (activeTab === "analytics") loadStats();
          }}
        />
      </div>
    </div>
  );
};
