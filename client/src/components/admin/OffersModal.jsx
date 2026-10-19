import { useState, useEffect } from "react";
import { productAPI, adminAPI } from "../../services/api.js";
import {
  X,
  Plus,
  Trash2,
  ExternalLink,
  Edit2,
  AlertCircle,
  Save,
  CheckCircle2,
  RefreshCw,
  TrendingDown,
  ShoppingBag,
} from "lucide-react";

export const OffersModal = ({ isOpen, onClose, product, onUpdated }) => {
  const [offers, setOffers] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState(null);

  const [formData, setFormData] = useState({
    merchantId: "",
    price: "",
    originalPrice: "",
    externalUrl: "",
    condition: "Brand New",
    shipping: "Standard Delivery",
    inStock: true,
  });

  const loadData = async () => {
    if (!product) return;
    setLoading(true);
    setError(null);
    try {
      const [offersRes, merchantsRes] = await Promise.all([
        productAPI.getProductOffers(product.id || product._id),
        adminAPI.getMerchants(),
      ]);

      if (offersRes.success) {
        setOffers(offersRes.offers || []);
      }
      if (merchantsRes.success) {
        setMerchants(merchantsRes.merchants || []);
        if (merchantsRes.merchants.length > 0 && !formData.merchantId) {
          setFormData((prev) => ({
            ...prev,
            merchantId: merchantsRes.merchants[0].id || merchantsRes.merchants[0]._id,
          }));
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && product) {
      loadData();
      setShowAddForm(false);
      setEditingOfferId(null);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const formatPrice = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handleEditClick = (offer) => {
    setEditingOfferId(offer.id || offer._id);
    setFormData({
      merchantId: offer.merchant?.id || offer.merchant?._id || offer.merchant,
      price: offer.price,
      originalPrice: offer.originalPrice || "",
      externalUrl: offer.externalUrl,
      condition: offer.condition || "Brand New",
      shipping: offer.shipping || "Standard Delivery",
      inStock: offer.inStock !== undefined ? offer.inStock : true,
    });
    setShowAddForm(true);
  };

  const handleDeleteOffer = async (offerId) => {
    if (window.confirm("Are you sure you want to delete this merchant offer?")) {
      try {
        const res = await adminAPI.deleteOffer(offerId);
        if (res.success) {
          await loadData();
          if (onUpdated) onUpdated();
        }
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete offer");
      }
    }
  };

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (editingOfferId) {
        // Update offer
        const res = await adminAPI.updateOffer(editingOfferId, {
          price: Number(formData.price),
          originalPrice: Number(formData.originalPrice) || 0,
          externalUrl: formData.externalUrl,
          condition: formData.condition,
          shipping: formData.shipping,
          inStock: formData.inStock,
        });
        if (res.success) {
          setEditingOfferId(null);
          setShowAddForm(false);
          await loadData();
          if (onUpdated) onUpdated();
        }
      } else {
        // Add new offer
        const res = await adminAPI.addOffer(product.id || product._id, {
          merchantId: formData.merchantId,
          price: Number(formData.price),
          originalPrice: Number(formData.originalPrice) || 0,
          externalUrl: formData.externalUrl,
          condition: formData.condition,
          shipping: formData.shipping,
          inStock: formData.inStock,
        });
        if (res.success) {
          setShowAddForm(false);
          setFormData((prev) => ({
            ...prev,
            price: "",
            originalPrice: "",
            externalUrl: "",
          }));
          await loadData();
          if (onUpdated) onUpdated();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save offer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "760px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          background: "#0c1424",
          border: "1px solid var(--border-medium)",
          borderRadius: "1rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--border-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="badge badge-emerald">Merchant Offers</span>
              <span className="badge badge-blue">{product.modelNumber}</span>
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff", marginTop: "0.25rem" }}>
              {product.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: "0.4rem", borderRadius: "50%" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ overflowY: "auto", padding: "1.5rem", flex: 1 }}>
          {error && (
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                color: "#f87171",
                fontSize: "0.85rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Top Actions: Add New Offer Button */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {offers.length} active merchant {offers.length === 1 ? "offer" : "offers"} associated
            </div>
            {!showAddForm && (
              <button
                type="button"
                onClick={() => {
                  setEditingOfferId(null);
                  setShowAddForm(true);
                }}
                className="btn btn-primary btn-sm"
              >
                <Plus size={15} /> Add Store Offer
              </button>
            )}
          </div>

          {/* Add / Edit Offer Form */}
          {showAddForm && (
            <div
              className="glass-card"
              style={{
                padding: "1.25rem",
                marginBottom: "1.5rem",
                background: "rgba(16, 24, 42, 0.9)",
                border: "1.5px solid var(--accent-emerald)",
                borderRadius: "0.75rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--accent-emerald)" }}>
                  {editingOfferId ? "Edit Merchant Offer" : "Associate New Merchant Offer"}
                </h4>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: "0.2rem 0.5rem" }}
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmitOffer}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                      Merchant Store <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <select
                      value={formData.merchantId}
                      onChange={(e) => setFormData({ ...formData, merchantId: e.target.value })}
                      disabled={Boolean(editingOfferId)}
                      className="input"
                      style={{ background: "#0a101d", fontSize: "0.85rem" }}
                      required
                    >
                      {merchants.map((m) => (
                        <option key={m.id || m._id} value={m.id || m._id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                      Offer Price ($) <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g. 1199"
                      className="input"
                      style={{ fontSize: "0.85rem" }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                      Original MSRP ($) (Optional)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="e.g. 1299"
                      className="input"
                      style={{ fontSize: "0.85rem" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                      Condition
                    </label>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="input"
                      style={{ background: "#0a101d", fontSize: "0.85rem" }}
                    >
                      <option value="Brand New">Brand New</option>
                      <option value="Refurbished">Refurbished</option>
                      <option value="Open Box">Open Box</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ display: "block", fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>
                    Destination Product URL <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.externalUrl}
                    onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                    placeholder="https://www.amazon.com/dp/..."
                    className="input"
                    style={{ fontSize: "0.85rem" }}
                    required
                  />
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                    Must be an authorized external HTTP or HTTPS URL (validated server-side).
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#fff", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                      style={{ accentColor: "var(--accent-emerald)" }}
                    />
                    In Stock &amp; Available
                  </label>
                  <button type="submit" disabled={saving} className="btn btn-primary btn-sm">
                    <Save size={14} /> {saving ? "Saving..." : editingOfferId ? "Update Offer" : "Save Offer"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Offers List */}
          {loading ? (
            <div style={{ padding: "2rem 0", textAlign: "center", color: "var(--text-secondary)" }}>
              <RefreshCw size={24} className="animate-spin" style={{ color: "var(--accent-emerald)", margin: "0 auto 0.5rem" }} />
              <div>Loading merchant offers...</div>
            </div>
          ) : offers.length === 0 ? (
            <div
              style={{
                padding: "2.5rem 1rem",
                textAlign: "center",
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: "0.75rem",
                border: "1px dashed var(--border-subtle)",
              }}
            >
              <ShoppingBag size={32} style={{ color: "var(--text-muted)", margin: "0 auto 0.75rem" }} />
              <div style={{ fontWeight: 600, color: "#fff" }}>No Merchant Offers Configured</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                This canonical product currently has 0 merchant offers. Click "+ Add Store Offer" above to associate one.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {offers.map((offer) => {
                const offerId = offer.id || offer._id;
                const isLowest = offer.price === product.lowestPrice;

                return (
                  <div
                    key={offerId}
                    style={{
                      padding: "0.85rem 1.25rem",
                      borderRadius: "0.5rem",
                      background: isLowest ? "rgba(16, 185, 129, 0.06)" : "rgba(255, 255, 255, 0.02)",
                      border: `1px solid ${isLowest ? "rgba(16, 185, 129, 0.3)" : "var(--border-subtle)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "6px",
                          background: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "3px",
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
                          {isLowest && <span className="badge badge-emerald" style={{ fontSize: "0.6rem", padding: "1px 5px" }}>LOWEST</span>}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {offer.condition} · {offer.inStock ? "In Stock" : "Out of Stock"}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.2rem", fontWeight: 800, color: isLowest ? "var(--accent-emerald)" : "#fff" }}>
                        {formatPrice(offer.price)}
                      </div>
                      {offer.originalPrice > offer.price && (
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textDecoration: "line-through" }}>
                          {formatPrice(offer.originalPrice)}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <a
                        href={offer.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm"
                        style={{ padding: "0.35rem 0.5rem" }}
                        title="Open external merchant URL"
                      >
                        <ExternalLink size={14} />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleEditClick(offer)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: "0.35rem 0.5rem", color: "var(--accent-cyan)" }}
                        title="Edit offer"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteOffer(offerId)}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: "0.35rem 0.5rem", color: "#f87171" }}
                        title="Delete offer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
