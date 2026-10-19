import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { productAPI } from "../services/api.js";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  Layers,
  ArrowLeft,
  RefreshCw,
  Star,
  ChevronRight,
  TrendingDown,
  ShoppingBag,
  Info,
  Heart,
} from "lucide-react";

export const ProductDetailsPage = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isSaved = product ? isInWishlist(product.id || product._id) : false;

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (product) {
      await toggleWishlist(product);
    }
  };

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productAPI.getProduct(idOrSlug);
        if (data.success && data.product) {
          setProduct(data.product);
          setSelectedImage(
            data.product.thumbnail || (data.product.images && data.product.images[0]) || ""
          );
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [idOrSlug]);

  const formatPrice = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
          <RefreshCw size={36} className="animate-spin" style={{ color: "var(--accent-emerald)", margin: "0 auto 1rem" }} />
          <div>Retrieving canonical product specifications &amp; live merchant offers...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: "5rem 0", textAlign: "center" }}>
        <AlertCircle size={48} style={{ color: "#ef4444", margin: "0 auto 1rem" }} />
        <h2>Product Not Found</h2>
        <p style={{ margin: "0.5rem auto 1.5rem", maxWidth: "450px" }}>
          {error || "The product you requested does not exist or has been removed."}
        </p>
        <Link to="/products" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Products Catalog
        </Link>
      </div>
    );
  }

  // Find lowest price offer
  const lowestOffer = product.offers && product.offers.length > 0 ? product.offers[0] : null;

  return (
    <div style={{ padding: "2.5rem 0 5rem" }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          <Link to="/" style={{ color: "var(--text-secondary)" }}>
            Home
          </Link>
          <ChevronRight size={14} />
          <Link to="/products" style={{ color: "var(--text-secondary)" }}>
            Products
          </Link>
          <ChevronRight size={14} />
          <Link to={`/products?category=${product.category}`} style={{ color: "var(--text-secondary)", textTransform: "capitalize" }}>
            {product.category?.replace("-", " ")}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: "#fff", fontWeight: 600 }}>{product.brand}</span>
        </div>

        {/* Top Product Hero Grid: Left Gallery, Right Best Deal Box */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3.5rem",
          }}
        >
          {/* Left: Gallery */}
          <div>
            <div
              className="glass-card"
              style={{
                width: "100%",
                paddingTop: "75%",
                position: "relative",
                borderRadius: "1rem",
                overflow: "hidden",
                background: "#080e1c",
                marginBottom: "1rem",
              }}
            >
              <img
                src={selectedImage}
                alt={product.name}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Thumbnail Row */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto" }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                      border: `2px solid ${selectedImage === img ? "var(--accent-emerald)" : "var(--border-subtle)"}`,
                      background: "#080e1c",
                      padding: 0,
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Summary & Lowest Price Buy Box */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span className="badge badge-emerald" style={{ textTransform: "uppercase" }}>
                {product.category?.replace("-", " ")}
              </span>
              <span className="badge badge-blue">Canonical Key: {product.modelNumber}</span>
            </div>

            <h1 style={{ fontSize: "2rem", lineHeight: 1.25, marginBottom: "0.5rem" }}>
              {product.name}
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              <span>Brand: <strong style={{ color: "#fff" }}>{product.brand}</strong></span>
              <span>Model: <strong style={{ color: "#fff" }}>{product.model}</strong></span>
              <span>Model Number: <strong style={{ color: "#38bdf8", fontFamily: "var(--font-mono)" }}>{product.modelNumber}</strong></span>
            </div>

            {/* Highlighted Best Offer Box (Module 2 requirement) */}
            <div
              className="glass-card"
              style={{
                padding: "1.75rem",
                borderRadius: "1rem",
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)",
                border: "1.5px solid rgba(16, 185, 129, 0.35)",
                marginBottom: "1.75rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span className="badge badge-emerald" style={{ fontSize: "0.75rem" }}>
                  ★ Lowest Price Identified
                </span>
                {lowestOffer?.savings > 0 && (
                  <span style={{ fontSize: "0.8rem", color: "#34d399", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <TrendingDown size={14} /> Save {lowestOffer.savings}% vs MSRP
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", marginBottom: "0.5rem" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--accent-emerald)", fontFamily: "var(--font-heading)" }}>
                  {formatPrice(product.lowestPrice)}
                </div>
                {lowestOffer?.originalPrice > lowestOffer?.price && (
                  <div style={{ fontSize: "1.2rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                    {formatPrice(lowestOffer.originalPrice)}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {lowestOffer && (
                  <a
                    href={productAPI.getRedirectUrl(lowestOffer.id || lowestOffer._id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-lg"
                    style={{ flex: 2, minWidth: "220px", justifyContent: "center", fontSize: "1.05rem" }}
                  >
                    Buy Now at {lowestOffer.merchantName} <ExternalLink size={18} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleWishlistToggle}
                  className={`btn ${isSaved ? "btn-outline" : "btn-secondary"} btn-lg`}
                  style={{
                    flex: 1,
                    minWidth: "160px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    borderColor: isSaved ? "#ef4444" : undefined,
                    color: isSaved ? "#ef4444" : undefined,
                  }}
                >
                  <Heart size={18} fill={isSaved ? "#ef4444" : "none"} />
                  <span>{isSaved ? "Saved" : "Save Item"}</span>
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", fontSize: "0.75rem", color: "var(--text-muted)", justifyContent: "center" }}>
                <ShieldCheck size={14} style={{ color: "var(--accent-emerald)" }} />
                <span>Redirects securely to authorized external store with tracking</span>
              </div>
            </div>

            {/* Short description */}
            <p style={{ lineHeight: 1.6, fontSize: "0.95rem" }}>
              {product.description}
            </p>
          </div>
        </div>

        {/* Module 2: All Available Merchant Offers Comparison Table */}
        <section style={{ marginBottom: "3.5rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <span className="badge badge-gold" style={{ marginBottom: "0.5rem" }}>
              Multi-Store Price Comparison
            </span>
            <h2 style={{ fontSize: "1.6rem" }}>Compare Live Merchant Offers</h2>
            <p style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
              All verified stores selling canonical model <strong>{product.modelNumber}</strong>. We automatically highlight the lowest price.
            </p>
          </div>

          <div
            className="glass-card"
            style={{
              overflowX: "auto",
              background: "rgba(10, 16, 29, 0.8)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "rgba(255, 255, 255, 0.02)" }}>
                  <th style={{ padding: "1rem 1.25rem", color: "var(--text-muted)", fontWeight: 600 }}>Merchant Store</th>
                  <th style={{ padding: "1rem 1.25rem", color: "var(--text-muted)", fontWeight: 600 }}>Condition &amp; Stock</th>
                  <th style={{ padding: "1rem 1.25rem", color: "var(--text-muted)", fontWeight: 600 }}>Delivery</th>
                  <th style={{ padding: "1rem 1.25rem", color: "var(--text-muted)", fontWeight: 600 }}>Listed Price</th>
                  <th style={{ padding: "1rem 1.25rem", textAlign: "right", color: "var(--text-muted)", fontWeight: 600 }}>Direct Link</th>
                </tr>
              </thead>
              <tbody>
                {product.offers && product.offers.map((offer, idx) => {
                  const isLowest = offer.isLowestPrice || idx === 0;
                  return (
                    <tr
                      key={offer.id || offer._id}
                      style={{
                        borderBottom: "1px solid var(--border-subtle)",
                        background: isLowest ? "rgba(16, 185, 129, 0.04)" : "transparent",
                        transition: "background var(--transition-fast)",
                      }}
                    >
                      {/* Merchant */}
                      <td style={{ padding: "1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "8px",
                              background: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "4px",
                            }}
                          >
                            <img
                              src={offer.merchant?.logo || "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"}
                              alt={offer.merchantName}
                              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                            />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                              {offer.merchantName}
                              {isLowest && <span className="badge badge-emerald" style={{ fontSize: "0.65rem", padding: "1px 5px" }}>BEST DEAL</span>}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              Trust Score: {offer.merchant?.trustScore || 95}%
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Condition & Stock */}
                      <td style={{ padding: "1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: offer.inStock ? "#34d399" : "#f87171", fontWeight: 600, fontSize: "0.85rem" }}>
                          <CheckCircle2 size={14} /> {offer.condition || "Brand New"}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {offer.inStock ? "In Stock & Ready to Ship" : "Out of Stock"}
                        </div>
                      </td>

                      {/* Delivery */}
                      <td style={{ padding: "1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-secondary)" }}>
                          <Truck size={15} style={{ color: "var(--accent-cyan)" }} />
                          <span>{offer.shipping || "Standard Shipping"}</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td style={{ padding: "1.25rem" }}>
                        <div style={{ fontSize: "1.2rem", fontWeight: 800, color: isLowest ? "var(--accent-emerald)" : "#fff", fontFamily: "var(--font-heading)" }}>
                          {formatPrice(offer.price)}
                        </div>
                        {offer.originalPrice > offer.price && (
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                            {formatPrice(offer.originalPrice)}
                          </div>
                        )}
                      </td>

                      {/* CTA Redirection */}
                      <td style={{ padding: "1.25rem", textAlign: "right" }}>
                        <a
                          href={productAPI.getRedirectUrl(offer.id || offer._id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`btn btn-sm ${isLowest ? "btn-primary" : "btn-secondary"}`}
                          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                        >
                          Buy Now <ExternalLink size={14} />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Specifications Table */}
        {product.specifications && product.specifications.length > 0 && (
          <section style={{ marginBottom: "3.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1.25rem" }}>Key Technical Specifications</h2>
            <div
              className="glass-card"
              style={{
                padding: "1.5rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.25rem",
                background: "rgba(10, 16, 29, 0.7)",
              }}
            >
              {product.specifications.map((spec, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "0.85rem",
                    borderRadius: "0.5rem",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    {spec.key}
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#fff", marginTop: "0.2rem" }}>
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
