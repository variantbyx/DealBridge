import { useState, useEffect } from "react";
import { adminAPI } from "../../services/api.js";
import { X, Plus, Trash2, Check, AlertCircle, Save, Layers } from "lucide-react";

export const ProductModal = ({ isOpen, onClose, product, onSaved }) => {
  const isEditing = Boolean(product && (product.id || product._id));

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    model: "",
    modelNumber: "",
    category: "smartphones",
    description: "",
    thumbnail: "",
    isAvailable: true,
    specifications: [{ key: "", value: "" }],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        brand: product.brand || "",
        model: product.model || "",
        modelNumber: product.modelNumber || "",
        category: product.category || "smartphones",
        description: product.description || "",
        thumbnail: product.thumbnail || "",
        isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
        specifications:
          product.specifications && product.specifications.length > 0
            ? product.specifications.map((s) => ({ key: s.key, value: s.value }))
            : [{ key: "", value: "" }],
      });
    } else {
      setFormData({
        name: "",
        brand: "",
        model: "",
        modelNumber: "",
        category: "smartphones",
        description: "",
        thumbnail: "",
        isAvailable: true,
        specifications: [{ key: "", value: "" }],
      });
    }
    setError(null);
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSpecChange = (index, field, value) => {
    const updated = [...formData.specifications];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, specifications: updated }));
  };

  const addSpecRow = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const removeSpecRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Filter out empty specifications
      const validSpecs = formData.specifications.filter(
        (s) => s.key.trim() && s.value.trim()
      );

      const payload = {
        ...formData,
        specifications: validSpecs,
      };

      let result;
      if (isEditing) {
        result = await adminAPI.updateProduct(product.id || product._id, payload);
      } else {
        result = await adminAPI.createProduct(payload);
      }

      if (result.success) {
        onSaved(result.product);
        onClose();
      } else {
        setError(result.message || "Failed to save product");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error processing request");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "watches", label: "Watches" },
    { id: "smartphones", label: "Smartphones" },
    { id: "laptops", label: "Laptops" },
    { id: "headphones", label: "Headphones" },
    { id: "fashion", label: "Fashion" },
    { id: "home-appliances", label: "Home Appliances" },
  ];

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
          maxWidth: "680px",
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
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff" }}>
              {isEditing ? "Edit Canonical Product" : "Create New Canonical Product"}
            </h3>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              {isEditing
                ? `Canonical Key: ${product.modelNumber} (${product.brand})`
                : "Add a new standardized product specification to the DealBridge catalog"}
            </div>
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

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSubmit} style={{ overflowY: "auto", padding: "1.5rem", flex: 1 }}>
          {error && (
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.4)",
                color: "#f87171",
                fontSize: "0.85rem",
                marginBottom: "1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                Brand <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Apple, Rolex, Sony"
                className="input"
                required
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                Model <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. iPhone 16 Pro Max, Submariner"
                className="input"
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                Model Number / Canonical Key <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="text"
                name="modelNumber"
                value={formData.modelNumber}
                onChange={handleChange}
                placeholder="e.g. A3296, 126610LN"
                className="input"
                required
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
                Category <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input"
                style={{ background: "#0a101d" }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
              Full Display Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Apple iPhone 16 Pro Max (256GB, Desert Titanium)"
              className="input"
              required
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
              Thumbnail Image URL
            </label>
            <input
              type="url"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="https://..."
              className="input"
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.35rem" }}>
              Product Description <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Provide a comprehensive product description..."
              className="input"
              style={{ resize: "vertical" }}
              required
            />
          </div>

          {/* Specifications Builder */}
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                Key Technical Specifications
              </label>
              <button
                type="button"
                onClick={addSpecRow}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: "0.75rem", padding: "0.2rem 0.5rem", color: "var(--accent-emerald)" }}
              >
                <Plus size={14} /> Add Row
              </button>
            </div>

            {formData.specifications.map((spec, idx) => (
              <div key={idx} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <input
                  type="text"
                  placeholder="Key (e.g. Storage)"
                  value={spec.key}
                  onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
                  className="input"
                  style={{ flex: 1, fontSize: "0.825rem" }}
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 256GB NVMe)"
                  value={spec.value}
                  onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                  className="input"
                  style={{ flex: 1.5, fontSize: "0.825rem" }}
                />
                {formData.specifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSpecRow(idx)}
                    className="btn btn-ghost btn-sm"
                    style={{ color: "#f87171", padding: "0 0.5rem" }}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Availability Toggle */}
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff" }}>
                Catalog Availability Status
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                When deactivated, this product is hidden from customer search results.
              </div>
            </div>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                style={{ width: "18px", height: "18px", accentColor: "var(--accent-emerald)" }}
              />
            </label>
          </div>

          {/* Modal Footer Actions */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "0.75rem",
              marginTop: "1.5rem",
              paddingTop: "1rem",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <button type="button" onClick={onClose} disabled={loading} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Save size={16} /> {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
