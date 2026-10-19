import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { productAPI } from "../services/api.js";
import { ProductCard } from "../components/products/ProductCard.jsx";
import { ProductFilters } from "../components/products/ProductFilters.jsx";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  RefreshCw,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Watch,
  Smartphone,
  Laptop,
  Headphones,
  Shirt,
  Home,
} from "lucide-react";

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "all",
    brand: searchParams.get("brand") || "all",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    inStock: searchParams.get("inStock") === "true",
    sort: searchParams.get("sort") || "popular",
    page: parseInt(searchParams.get("page") || "1", 10),
  });

  const fetchProducts = useCallback(async (currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (currentFilters.search) params.search = currentFilters.search;
      if (currentFilters.category && currentFilters.category !== "all") params.category = currentFilters.category;
      if (currentFilters.brand && currentFilters.brand !== "all") params.brand = currentFilters.brand;
      if (currentFilters.minPrice) params.minPrice = currentFilters.minPrice;
      if (currentFilters.maxPrice) params.maxPrice = currentFilters.maxPrice;
      if (currentFilters.inStock) params.inStock = true;
      if (currentFilters.sort) params.sort = currentFilters.sort;
      params.page = currentFilters.page || 1;
      params.limit = 12;

      const data = await productAPI.getProducts(params);
      if (data.success) {
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
        if (data.facets && data.facets.brands) {
          setAvailableBrands(data.facets.brands);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load product catalog");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  // Handle Search Input Change
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      category: "all",
      brand: "all",
      minPrice: "",
      maxPrice: "",
      inStock: false,
      sort: "popular",
      page: 1,
    });
  };

  const categoryIcons = [
    { id: "all", name: "All Categories", icon: null },
    { id: "smartphones", name: "Smartphones", icon: Smartphone },
    { id: "laptops", name: "Laptops", icon: Laptop },
    { id: "watches", name: "Watches", icon: Watch },
    { id: "headphones", name: "Headphones", icon: Headphones },
    { id: "fashion", name: "Fashion", icon: Shirt },
    { id: "home-appliances", name: "Home Appliances", icon: Home },
  ];

  return (
    <div style={{ padding: "2.5rem 0 5rem" }}>
      <div className="container">
        {/* Page Top Heading & Live Search */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span className="badge badge-emerald">Module 1: Product Discovery</span>
            <span className="badge badge-blue">Multi-Merchant Comparison</span>
          </div>
          <h1>Discover Products &amp; Compare Live Offers</h1>
          <p style={{ fontSize: "1.05rem", maxWidth: "750px", marginTop: "0.4rem" }}>
            Find the lowest available prices across Amazon, Best Buy, Flipkart, and leading authorized merchants with real-time price validation.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{ marginTop: "1.5rem", maxWidth: "680px" }}>
            <div className="input-with-icon" style={{ position: "relative" }}>
              <Search size={20} className="input-icon" />
              <input
                type="text"
                placeholder="Search by product name, brand, or model number (e.g. iPhone 16, Rolex, XPS 15)..."
                className="form-input"
                style={{ padding: "0.95rem 1rem 0.95rem 3rem", fontSize: "1rem", borderRadius: "0.75rem" }}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              />
              {filters.search && (
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, search: "", page: 1 })}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </form>

          {/* Category Quick Pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "1.25rem",
              overflowX: "auto",
              paddingBottom: "0.5rem",
            }}
          >
            {categoryIcons.map((cat) => {
              const Icon = cat.icon;
              const isSelected = filters.category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilters({ ...filters, category: cat.id, page: 1 })}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.5rem 0.9rem",
                    borderRadius: "9999px",
                    border: `1px solid ${isSelected ? "var(--accent-emerald)" : "var(--border-subtle)"}`,
                    background: isSelected ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.03)",
                    color: isSelected ? "#34d399" : "var(--text-secondary)",
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  {Icon && <Icon size={14} />}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Catalog Layout: Left Sidebar + Right Products Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "2rem", alignItems: "start" }}>
          {/* Left Column: Filters */}
          <aside>
            <ProductFilters
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
              availableBrands={availableBrands}
              totalProducts={total}
            />
          </aside>

          {/* Right Column: Grid and Controls */}
          <div>
            {/* Top Toolbar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "1.5rem",
                padding: "0.85rem 1.25rem",
                background: "rgba(10, 16, 29, 0.6)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "0.75rem",
              }}
            >
              <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                Showing <strong style={{ color: "#fff" }}>{products.length}</strong> of{" "}
                <strong style={{ color: "#fff" }}>{total}</strong> products
                {filters.category !== "all" && (
                  <span> in <span style={{ color: "#34d399" }}>{filters.category}</span></span>
                )}
              </div>

              {/* Sort Selector */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <ArrowUpDown size={14} /> Sort By:
                </span>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value, page: 1 })}
                  className="form-select"
                  style={{ width: "auto", padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                >
                  <option value="popular">Most Popular</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-danger" style={{ marginBottom: "1.5rem" }}>
                {error}
              </div>
            )}

            {/* Loading Spinner */}
            {loading ? (
              <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-secondary)" }}>
                <RefreshCw size={32} className="animate-spin" style={{ color: "var(--accent-emerald)", margin: "0 auto 1rem" }} />
                <div>Searching verified canonical products...</div>
              </div>
            ) : products.length === 0 ? (
              <div
                className="glass-card"
                style={{
                  padding: "4rem 2rem",
                  textAlign: "center",
                  background: "rgba(10, 16, 29, 0.6)",
                }}
              >
                <ShoppingBag size={48} style={{ color: "var(--text-muted)", margin: "0 auto 1rem" }} />
                <h3>No Products Found</h3>
                <p style={{ maxWidth: "400px", margin: "0.5rem auto 1.5rem" }}>
                  We couldn't find any products matching your current search or filter criteria.
                </p>
                <button onClick={handleResetFilters} className="btn btn-primary btn-sm">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
                    gap: "1.5rem",
                    marginBottom: "2.5rem",
                  }}
                >
                  {products.map((p) => (
                    <ProductCard key={p.id || p._id} product={p} />
                  ))}
                </div>

                {/* Pagination Bar */}
                {totalPages > 1 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      marginTop: "2rem",
                    }}
                  >
                    <button
                      onClick={() => setFilters({ ...filters, page: Math.max(1, currentPage - 1) })}
                      disabled={currentPage === 1}
                      className="btn btn-secondary btn-sm"
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        onClick={() => setFilters({ ...filters, page: num })}
                        className={`btn btn-sm ${num === currentPage ? "btn-primary" : "btn-secondary"}`}
                        style={{ minWidth: "36px" }}
                      >
                        {num}
                      </button>
                    ))}

                    <button
                      onClick={() => setFilters({ ...filters, page: Math.min(totalPages, currentPage + 1) })}
                      disabled={currentPage === totalPages}
                      className="btn btn-secondary btn-sm"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
