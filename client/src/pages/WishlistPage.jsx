import { useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Heart,
  Trash2,
  ExternalLink,
  ShoppingBag,
  ArrowRight,
  TrendingDown,
  Layers,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Tag,
} from "lucide-react";

export const WishlistPage = () => {
  const { wishlist, wishlistCount, loading, removeFromWishlist, clearWishlist } = useWishlist();
  const { user } = useAuth();
  const [clearing, setClearing] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const formatPrice = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    try {
      await removeFromWishlist(productId);
    } finally {
      setRemovingId(null);
    }
  };

  const handleClear = async () => {
    if (window.confirm("Are you sure you want to remove all products from your wishlist?")) {
      setClearing(true);
      try {
        await clearWishlist();
      } finally {
        setClearing(false);
      }
    }
  };

  // Calculate summary metrics
  const totalValue = wishlist.reduce((acc, p) => acc + (p.lowestPrice || 0), 0);
  const totalOriginal = wishlist.reduce((acc, p) => {
    // If product has originalPrice or highestPrice, use that
    const orig = p.highestPrice || p.originalPrice || p.lowestPrice || 0;
    return acc + orig;
  }, 0);
  const totalSavings = Math.max(0, totalOriginal - totalValue);

  return (
    <div style={{ padding: "3rem 0 6rem" }}>
      <div className="container">
        {/* Page Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span className="badge badge-emerald">Module 4 · Personal Wishlist</span>
              <span className="badge badge-blue">Isolated User State</span>
            </div>
            <h1 style={{ fontSize: "2.25rem", lineHeight: 1.2 }}>
              Saved Wishlist &amp; Deal Tracker
            </h1>
            <p style={{ marginTop: "0.4rem", fontSize: "0.95rem", maxWidth: "600px" }}>
              Monitor live pricing across Amazon, Best Buy, Flipkart &amp; authorized merchants.
              Saved deals persist across your authenticated sessions.
            </p>
          </div>

          {wishlist.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Link to="/products" className="btn btn-secondary btn-sm">
                <ShoppingBag size={15} /> Continue Browsing
              </Link>
              <button
                type="button"
                onClick={handleClear}
                disabled={clearing}
                className="btn btn-outline btn-sm"
                style={{ borderColor: "rgba(239, 68, 68, 0.4)", color: "#f87171" }}
              >
                <Trash2 size={15} /> {clearing ? "Clearing..." : "Clear Wishlist"}
              </button>
            </div>
          )}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div style={{ padding: "4rem 0", textAlign: "center", color: "var(--text-secondary)" }}>
            <RefreshCw size={32} className="animate-spin" style={{ color: "var(--accent-emerald)", margin: "0 auto 1rem" }} />
            <div>Syncing your wishlist with DealBridge secure database...</div>
          </div>
        )}

        {/* Wishlist Content or Empty State */}
        {!loading && wishlist.length === 0 ? (
          <div
            className="glass-card"
            style={{
              padding: "4rem 2rem",
              textAlign: "center",
              maxWidth: "640px",
              margin: "2rem auto",
              borderRadius: "1.5rem",
              background: "rgba(12, 19, 34, 0.7)",
              border: "1px dashed var(--border-medium)",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1.5px solid rgba(239, 68, 68, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
                color: "#ef4444",
              }}
            >
              <Heart size={36} />
            </div>

            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>
              Your Wishlist is Empty
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.6,
                marginBottom: "2rem",
                maxWidth: "480px",
                margin: "0 auto 2rem",
              }}
            >
              You haven't saved any products yet. Browse through our catalog of verified deals,
              click the heart icon on any product, and DealBridge will track price movements for you.
            </p>

            <Link to="/products" className="btn btn-primary btn-lg">
              Explore Products Catalog <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          !loading && (
            <>
              {/* Summary Metrics Bar */}
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
                    Tracked Items
                  </div>
                  <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#fff", marginTop: "0.25rem" }}>
                    {wishlistCount} {wishlistCount === 1 ? "Product" : "Products"}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--accent-emerald)", marginTop: "0.25rem" }}>
                    Saved under {user?.email}
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
                    Aggregate Best Price
                  </div>
                  <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "var(--accent-cyan)", marginTop: "0.25rem" }}>
                    {formatPrice(totalValue)}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    Lowest current offers combined
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
                    Potential Savings
                  </div>
                  <div style={{ fontSize: "1.85rem", fontWeight: 800, color: "#f59e0b", marginTop: "0.25rem" }}>
                    {totalSavings > 0 ? formatPrice(totalSavings) : "Live Tracking"}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#34d399", marginTop: "0.25rem" }}>
                    Compared to canonical MSRP
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
                    Security &amp; Persistence
                  </div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <ShieldCheck size={18} style={{ color: "#34d399" }} /> 100% Isolated
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
                    MongoDB user-keyed collection
                  </div>
                </div>
              </div>

              {/* Wishlist Items List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {wishlist.map((item) => {
                  const itemId = item.id || item._id;
                  const isRemoving = removingId === itemId;

                  return (
                    <div
                      key={itemId}
                      className="glass-card glass-card-hover"
                      style={{
                        padding: "1.25rem 1.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "1.5rem",
                        flexWrap: "wrap",
                        background: "rgba(13, 20, 36, 0.8)",
                        transition: "all var(--transition-fast)",
                        opacity: isRemoving ? 0.4 : 1,
                      }}
                    >
                      {/* Thumbnail */}
                      <Link
                        to={`/product/${item.slug || itemId}`}
                        style={{
                          width: "100px",
                          height: "80px",
                          borderRadius: "0.5rem",
                          overflow: "hidden",
                          background: "#080e1c",
                          flexShrink: 0,
                          display: "block",
                        }}
                      >
                        <img
                          src={item.thumbnail || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300"}
                          alt={item.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </Link>

                      {/* Product Details */}
                      <div style={{ flex: "1 1 280px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                          <span className="badge badge-blue" style={{ fontSize: "0.65rem" }}>
                            {item.category?.replace("-", " ")}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                            {item.brand} · {item.modelNumber}
                          </span>
                        </div>
                        <Link to={`/product/${item.slug || itemId}`}>
                          <h3
                            style={{
                              fontSize: "1.05rem",
                              fontWeight: 700,
                              color: "#fff",
                              lineHeight: 1.3,
                              marginBottom: "0.25rem",
                            }}
                          >
                            {item.name}
                          </h3>
                        </Link>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                          Canonical ID: <code style={{ color: "#38bdf8" }}>{item.modelNumber}</code>
                        </div>
                      </div>

                      {/* Price Section */}
                      <div style={{ minWidth: "150px", textAlign: "right" }}>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase" }}>
                          Lowest Price
                        </div>
                        <div
                          style={{
                            fontSize: "1.45rem",
                            fontWeight: 800,
                            color: "var(--accent-emerald)",
                            fontFamily: "var(--font-heading)",
                          }}
                        >
                          {formatPrice(item.lowestPrice)}
                        </div>
                        {item.highestPrice > item.lowestPrice && (
                          <div style={{ fontSize: "0.75rem", color: "#34d399", fontWeight: 600 }}>
                            Save up to {formatPrice(item.highestPrice - item.lowestPrice)}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <Link
                          to={`/product/${item.slug || itemId}`}
                          className="btn btn-primary btn-sm"
                          style={{ gap: "0.4rem" }}
                        >
                          View Deals <ExternalLink size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemove(itemId)}
                          disabled={isRemoving}
                          className="btn btn-ghost btn-sm"
                          style={{ color: "#f87171", padding: "0.4rem 0.6rem" }}
                          title="Remove from wishlist"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};
