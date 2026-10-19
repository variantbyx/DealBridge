import { Link, useNavigate } from "react-router-dom";
import { ExternalLink, Tag, ShieldCheck, Heart, Layers } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";

export const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const isSaved = isInWishlist(product.id || product._id);

  const handleHeartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    await toggleWishlist(product);
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case "smartphones":
        return "badge-blue";
      case "watches":
        return "badge-gold";
      case "laptops":
        return "badge-purple";
      case "headphones":
        return "badge-emerald";
      default:
        return "badge-blue";
    }
  };

  return (
    <div
      className="glass-card glass-card-hover"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "1.25rem",
        transition: "all var(--transition-normal)",
        background: "rgba(14, 22, 38, 0.8)",
      }}
    >
      {/* Thumbnail with overlay tags */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "68%",
          borderRadius: "0.75rem",
          overflow: "hidden",
          background: "#080e1c",
          marginBottom: "1rem",
        }}
      >
        <Link to={`/product/${product.slug || product.id}`}>
          <img
            src={product.thumbnail || (product.images && product.images[0]) || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"}
            alt={product.name}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            loading="lazy"
          />
        </Link>

        {/* Wishlist Heart Button in top-right */}
        <button
          type="button"
          onClick={handleHeartClick}
          style={{
            position: "absolute",
            top: "0.6rem",
            right: "0.6rem",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: isSaved ? "rgba(239, 68, 68, 0.2)" : "rgba(7, 11, 20, 0.75)",
            backdropFilter: "blur(4px)",
            border: `1px solid ${isSaved ? "#ef4444" : "rgba(255, 255, 255, 0.15)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isSaved ? "#ef4444" : "#cbd5e1",
            cursor: "pointer",
            transition: "all 0.2s ease",
            zIndex: 2,
          }}
          title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart size={16} fill={isSaved ? "#ef4444" : "none"} />
        </button>

        {/* Category Pill */}
        <div style={{ position: "absolute", top: "0.6rem", left: "0.6rem" }}>
          <span className={`badge ${getCategoryColor(product.category)}`} style={{ fontSize: "0.675rem" }}>
            {product.category?.replace("-", " ")}
          </span>
        </div>

        {/* Offer count tag */}
        {product.offerCount > 0 && (
          <div
            style={{
              position: "absolute",
              bottom: "0.6rem",
              right: "0.6rem",
              background: "rgba(7, 11, 20, 0.85)",
              backdropFilter: "blur(4px)",
              padding: "0.2rem 0.5rem",
              borderRadius: "4px",
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "#38bdf8",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
            }}
          >
            <Layers size={11} /> {product.offerCount} stores
          </div>
        )}
      </div>

      {/* Brand & Title */}
      <div style={{ marginBottom: "0.5rem" }}>
        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {product.brand} · {product.modelNumber}
        </div>
        <Link to={`/product/${product.slug || product.id}`}>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              lineHeight: 1.35,
              marginTop: "0.25rem",
              color: "var(--text-highlight)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            title={product.name}
          >
            {product.name}
          </h3>
        </Link>
      </div>

      {/* Pricing and Offers Section */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: "0.75rem",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <div>
            <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>BEST PRICE FROM</div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--accent-emerald)", fontFamily: "var(--font-heading)" }}>
              {product.lowestPrice > 0 ? formatPrice(product.lowestPrice) : "Check Offers"}
            </div>
          </div>

          {product.highestPrice > product.lowestPrice && (
            <div style={{ textAlign: "right" }}>
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  textDecoration: "line-through",
                }}
              >
                {formatPrice(product.highestPrice)}
              </span>
              <div style={{ fontSize: "0.7rem", color: "#34d399", fontWeight: 700 }}>
                Save up to {formatPrice(product.highestPrice - product.lowestPrice)}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link
          to={`/product/${product.slug || product.id}`}
          className="btn btn-secondary btn-sm"
          style={{ width: "100%", justifyContent: "center", fontSize: "0.825rem" }}
        >
          Compare {product.offerCount || ""} Merchant Offers
        </Link>
      </div>
    </div>
  );
};
