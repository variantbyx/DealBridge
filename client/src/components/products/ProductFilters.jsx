import { Filter, RotateCcw, DollarSign, Layers } from "lucide-react";

export const ProductFilters = ({
  filters,
  onChange,
  onReset,
  availableBrands = [],
  totalProducts = 0,
}) => {
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "smartphones", name: "Smartphones" },
    { id: "laptops", name: "Laptops" },
    { id: "watches", name: "Watches" },
    { id: "headphones", name: "Headphones" },
    { id: "fashion", name: "Fashion" },
    { id: "home-appliances", name: "Home Appliances" },
  ];

  const handleBrandToggle = (brand) => {
    let currentBrands = filters.brand && filters.brand !== "all"
      ? filters.brand.split(",").map((b) => b.trim())
      : [];

    if (currentBrands.includes(brand)) {
      currentBrands = currentBrands.filter((b) => b !== brand);
    } else {
      currentBrands.push(brand);
    }

    onChange({
      ...filters,
      brand: currentBrands.length > 0 ? currentBrands.join(",") : "all",
      page: 1,
    });
  };

  const selectedBrands = filters.brand && filters.brand !== "all"
    ? filters.brand.split(",").map((b) => b.trim())
    : [];

  return (
    <div
      className="glass-card"
      style={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.75rem",
        background: "rgba(10, 16, 29, 0.75)",
      }}
    >
      {/* Filter Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Filter size={18} style={{ color: "var(--accent-emerald)" }} />
          <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Filter Catalog</h3>
        </div>
        <button
          onClick={onReset}
          className="btn btn-ghost btn-sm"
          style={{ padding: "0.2rem 0.5rem", fontSize: "0.75rem", color: "var(--text-muted)" }}
          title="Reset all filters"
        >
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <label className="form-label" style={{ marginBottom: "0.75rem", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
          Categories
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          {categories.map((cat) => {
            const isSelected = (!filters.category && cat.id === "all") || filters.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onChange({ ...filters, category: cat.id, page: 1 })}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.5rem",
                  border: "none",
                  background: isSelected ? "rgba(16, 185, 129, 0.15)" : "transparent",
                  color: isSelected ? "#34d399" : "var(--text-secondary)",
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all var(--transition-fast)",
                }}
              >
                <span>{cat.name}</span>
                {isSelected && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="form-label" style={{ marginBottom: "0.75rem", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
          Price Range (USD)
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "0.75rem" }}>
          <div className="input-with-icon">
            <span style={{ position: "absolute", left: "0.6rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>$</span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ""}
              onChange={(e) => onChange({ ...filters, minPrice: e.target.value, page: 1 })}
              className="form-input"
              style={{ paddingLeft: "1.5rem", fontSize: "0.85rem" }}
              min={0}
            />
          </div>
          <div className="input-with-icon">
            <span style={{ position: "absolute", left: "0.6rem", color: "var(--text-muted)", fontSize: "0.8rem" }}>$</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ""}
              onChange={(e) => onChange({ ...filters, maxPrice: e.target.value, page: 1 })}
              className="form-input"
              style={{ paddingLeft: "1.5rem", fontSize: "0.85rem" }}
              min={0}
            />
          </div>
        </div>

        {/* Quick Price Buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {[
            { label: "< $500", min: 0, max: 500 },
            { label: "$500 - $1.5K", min: 500, max: 1500 },
            { label: "> $1.5K", min: 1500, max: "" },
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange({ ...filters, minPrice: preset.min, maxPrice: preset.max, page: 1 })}
              style={{
                fontSize: "0.725rem",
                padding: "0.25rem 0.5rem",
                borderRadius: "4px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      {availableBrands.length > 0 && (
        <div>
          <label className="form-label" style={{ marginBottom: "0.75rem", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
            Brands
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", maxHeight: "200px", overflowY: "auto" }}>
            {availableBrands.map((b) => {
              const checked = selectedBrands.includes(b);
              return (
                <label
                  key={b}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    fontSize: "0.85rem",
                    color: checked ? "#fff" : "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleBrandToggle(b)}
                    style={{ accentColor: "var(--accent-emerald)", cursor: "pointer" }}
                  />
                  <span>{b}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* In-Stock Toggle */}
      <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "1rem" }}>
        <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>In-Stock Only</span>
          <input
            type="checkbox"
            checked={filters.inStock === "true" || filters.inStock === true}
            onChange={(e) => onChange({ ...filters, inStock: e.target.checked, page: 1 })}
            style={{ accentColor: "var(--accent-emerald)", width: "16px", height: "16px" }}
          />
        </label>
      </div>
    </div>
  );
};
