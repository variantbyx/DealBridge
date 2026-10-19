import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useHealth } from "../context/HealthContext.jsx";
import { productAPI } from "../services/api.js";
import { ProductCard } from "../components/products/ProductCard.jsx";
import {
  ShieldCheck,
  TrendingUp,
  Tag,
  ArrowRight,
  CheckCircle2,
  Activity,
  Server,
  Database,
  Search,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Watch,
  Smartphone,
  Laptop,
  Headphones,
  Shirt,
  Home,
  Layers,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { health, isHealthy, refreshHealth, loading: healthLoading } = useHealth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      setLoadingProducts(true);
      try {
        const params = { limit: 8, sort: "popular" };
        if (selectedCategory !== "all") {
          params.category = selectedCategory;
        }
        const data = await productAPI.getProducts(params);
        if (data.success) {
          setFeaturedProducts(data.products || []);
        }
      } catch (err) {
        console.error("Failed to load featured products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadFeatured();
  }, [selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/products");
    }
  };

  const categories = [
    { id: "all", name: "All Products", icon: Sparkles, count: "10+ Items" },
    { id: "smartphones", name: "Smartphones", icon: Smartphone, count: "Flagship 5G" },
    { id: "laptops", name: "Laptops", icon: Laptop, count: "Pro Workstations" },
    { id: "watches", name: "Watches", icon: Watch, count: "Luxury & Smart" },
    { id: "headphones", name: "Headphones", icon: Headphones, count: "Audiophile & ANC" },
    { id: "fashion", name: "Fashion", icon: Shirt, count: "Sneakers & Apparel" },
    { id: "home-appliances", name: "Home Appliances", icon: Home, count: "Smart Living" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          padding: "4.5rem 0 3.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "860px", margin: "0 auto" }}>
            {/* Live System Health Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.4rem 1rem",
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.25)",
                borderRadius: "9999px",
                marginBottom: "1.5rem",
              }}
            >
              <span className={`status-dot ${isHealthy ? "status-dot-green" : "status-dot-red"}`} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: isHealthy ? "#34d399" : "#f87171" }}>
                DealBridge Platform Online
              </span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>·</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                Modules 1, 2, 3 Active
              </span>
            </div>

            <h1 style={{ marginBottom: "1.25rem", fontSize: "clamp(2.4rem, 5vw, 3.8rem)" }}>
              Smart Product Discovery &amp;{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Multi-Store Price Comparison
              </span>
            </h1>

            <p style={{ fontSize: "1.2rem", lineHeight: 1.6, marginBottom: "2.5rem" }}>
              Find the best prices on watches, smartphones, laptops, and electronics across Amazon, Best Buy, Flipkart, and authorized merchants in one unified place.
            </p>

            {/* Live Search Form in Hero */}
            <form onSubmit={handleSearch} style={{ maxWidth: "660px", margin: "0 auto 2.5rem" }}>
              <div className="input-with-icon" style={{ position: "relative" }}>
                <Search size={22} className="input-icon" />
                <input
                  type="text"
                  placeholder="Search products, brands, or models (e.g. iPhone 16, Rolex, MacBook)..."
                  className="form-input"
                  style={{
                    padding: "1rem 1rem 1rem 3.25rem",
                    fontSize: "1.05rem",
                    borderRadius: "0.85rem",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    position: "absolute",
                    right: "0.5rem",
                    top: "0.5rem",
                    bottom: "0.5rem",
                    padding: "0 1.25rem",
                    borderRadius: "0.6rem",
                  }}
                >
                  Search Deals
                </button>
              </div>
            </form>

            {/* Quick Action Links */}
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "3rem" }}>
              <Link to="/products" className="btn btn-primary btn-lg">
                Explore Full Catalog <ArrowRight size={18} />
              </Link>
              <Link to="/health" className="btn btn-secondary btn-lg">
                <Activity size={18} /> Phase 0 System Health
              </Link>
            </div>

            {/* Platform Stats Ribbon */}
            <div
              className="glass-card"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                padding: "1.75rem",
                gap: "1.5rem",
                textAlign: "center",
                background: "rgba(10, 16, 29, 0.7)",
              }}
            >
              <div>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", fontFamily: "var(--font-heading)" }}>
                  6 Categories
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  Watches, Tech &amp; Home
                </div>
              </div>
              <div style={{ borderLeft: "1px solid var(--border-subtle)" }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "#10b981", fontFamily: "var(--font-heading)" }}>
                  100%
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  Verified Canonical Matching
                </div>
              </div>
              <div style={{ borderLeft: "1px solid var(--border-subtle)" }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "#06b6d4", fontFamily: "var(--font-heading)" }}>
                  Top Stores
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  Amazon, Best Buy, Flipkart &amp; B&amp;H
                </div>
              </div>
              <div style={{ borderLeft: "1px solid var(--border-subtle)" }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "#f59e0b", fontFamily: "var(--font-heading)" }}>
                  Zero Cost
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  Free Public Discovery
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Browse Grid */}
      <section style={{ padding: "3rem 0", background: "rgba(10, 16, 29, 0.6)", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="badge badge-emerald" style={{ marginBottom: "0.5rem" }}>
              Explore By Category
            </span>
            <h2 style={{ fontSize: "2rem" }}>Browse Product Categories</h2>
            <p style={{ marginTop: "0.25rem" }}>
              Discover canonical models and compare prices from multiple external stores.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {categories.slice(1).map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.id}`}
                  className="glass-card glass-card-hover"
                  style={{
                    padding: "1.75rem 1.25rem",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.75rem",
                    background: "rgba(14, 22, 38, 0.7)",
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      background: "rgba(16, 185, 129, 0.12)",
                      border: "1px solid rgba(16, 185, 129, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#34d399",
                    }}
                  >
                    <Icon size={26} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>{cat.name}</h3>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      {cat.count}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products & Multi-Store Live Comparison */}
      <section style={{ padding: "4.5rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: "0.5rem" }}>
                Module 1 &amp; 2 Live Showcase
              </span>
              <h2>Featured Products &amp; Best Deals</h2>
              <p style={{ marginTop: "0.25rem" }}>
                Canonical models with real-time lowest price comparison across external merchants.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div style={{ display: "flex", gap: "0.4rem", background: "rgba(255, 255, 255, 0.04)", padding: "0.3rem", borderRadius: "0.5rem", overflowX: "auto" }}>
              <button
                onClick={() => setSelectedCategory("all")}
                className={`btn btn-sm ${selectedCategory === "all" ? "btn-primary" : "btn-ghost"}`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedCategory("smartphones")}
                className={`btn btn-sm ${selectedCategory === "smartphones" ? "btn-primary" : "btn-ghost"}`}
              >
                Smartphones
              </button>
              <button
                onClick={() => setSelectedCategory("laptops")}
                className={`btn btn-sm ${selectedCategory === "laptops" ? "btn-primary" : "btn-ghost"}`}
              >
                Laptops
              </button>
              <button
                onClick={() => setSelectedCategory("watches")}
                className={`btn btn-sm ${selectedCategory === "watches" ? "btn-primary" : "btn-ghost"}`}
              >
                Watches
              </button>
              <button
                onClick={() => setSelectedCategory("headphones")}
                className={`btn btn-sm ${selectedCategory === "headphones" ? "btn-primary" : "btn-ghost"}`}
              >
                Headphones
              </button>
            </div>
          </div>

          {/* Product Grid */}
          {loadingProducts ? (
            <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-secondary)" }}>
              <RefreshCw size={32} className="animate-spin" style={{ color: "var(--accent-emerald)", margin: "0 auto 1rem" }} />
              <div>Loading verified canonical products...</div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1.75rem",
              }}
            >
              {featuredProducts.map((p) => (
                <ProductCard key={p.id || p._id} product={p} />
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link to="/products" className="btn btn-secondary btn-lg">
              View All {categories.length - 1} Categories in Catalog <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* How DealBridge Works (Engineering Challenge & Architecture) */}
      <section style={{ padding: "5rem 0", background: "rgba(10, 16, 29, 0.7)", borderTop: "1px solid var(--border-subtle)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 3.5rem" }}>
            <span className="badge badge-purple" style={{ marginBottom: "0.5rem" }}>
              Technical Architecture
            </span>
            <h2>How DealBridge Normalizes &amp; Tracks Offers</h2>
            <p style={{ marginTop: "0.5rem" }}>
              Engineered according to SDE requirements: canonical product deduplication, non-blocking click tracking, and open-redirect prevention.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {/* Step 1 */}
            <div className="glass-card" style={{ padding: "2.25rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "rgba(59, 130, 246, 0.15)",
                  color: "#60a5fa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Canonical Product Normalization</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Different retailers list products with varying titles (e.g., "iPhone 16 Pro Max 256GB" vs "Apple iPhone 16 Pro Max"). Our deterministic key generator <code>brand:model:modelNumber</code> resolves them into one canonical entity.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card" style={{ padding: "2.25rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#34d399",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Lowest-Price Identification</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Each canonical product aggregates multiple <code>MerchantOffer</code> records. Our server-side query compares prices in real time, tagging the lowest price offer and sorting merchants from best deal to highest.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card" style={{ padding: "2.25rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  background: "rgba(245, 158, 11, 0.15)",
                  color: "#fbbf24",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Secure Non-Blocking Redirects</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                When users click "Buy Now", <code>GET /api/redirect/:offerId</code> validates the destination from our database (preventing open redirect vulnerabilities) and asynchronously logs a <code>ClickEvent</code> with zero user latency.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
