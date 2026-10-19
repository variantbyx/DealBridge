import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  User,
  Building2,
  Mail,
  ShieldCheck,
  Calendar,
  Key,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogOut,
  Lock,
  Layers,
  FileText,
  Sliders,
  DollarSign,
  TrendingUp,
  Briefcase,
} from "lucide-react";

export const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    company: user?.company || "",
    bio: user?.bio || "",
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccessMessage("");
    setErrorMessage("");

    const result = await updateProfile(formData);
    setIsUpdating(false);

    if (result.success) {
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } else {
      setErrorMessage(result.message || "Failed to update profile");
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "buyer":
        return <span className="badge badge-blue">Verified Buyer</span>;
      case "seller":
        return <span className="badge badge-emerald">Verified Seller</span>;
      case "broker":
        return <span className="badge badge-gold">Licensed Broker</span>;
      default:
        return <span className="badge badge-purple">{role}</span>;
    }
  };

  return (
    <div style={{ padding: "3rem 0 5rem" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        {/* User Profile Header Card */}
        <div
          className="glass-card"
          style={{
            padding: "2.5rem",
            marginBottom: "2rem",
            background: "linear-gradient(180deg, #101c34 0%, #0d1629 100%)",
            border: "1px solid var(--border-medium)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
              alt={user?.name}
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid var(--accent-emerald)",
                boxShadow: "0 0 25px rgba(16, 185, 129, 0.3)",
              }}
            />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
                <h1 style={{ fontSize: "1.85rem", margin: 0 }}>{user?.name}</h1>
                {getRoleBadge(user?.role)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", color: "var(--text-secondary)", fontSize: "0.875rem", flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Mail size={15} style={{ color: "var(--accent-emerald)" }} /> {user?.email}
                </span>
                {user?.company && (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Building2 size={15} style={{ color: "var(--accent-cyan)" }} /> {user.company}
                  </span>
                )}
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Calendar size={15} style={{ color: "var(--accent-gold)" }} /> Member since{" "}
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "2026"}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={logout} className="btn btn-secondary btn-sm" style={{ color: "#f87171" }}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            borderBottom: "1px solid var(--border-subtle)",
            marginBottom: "2rem",
            overflowX: "auto",
          }}
        >
          <button
            onClick={() => setActiveTab("profile")}
            style={{
              padding: "0.75rem 1.25rem",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "profile" ? "2px solid var(--accent-emerald)" : "2px solid transparent",
              color: activeTab === "profile" ? "#fff" : "var(--text-secondary)",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.95rem",
            }}
          >
            <User size={16} /> Edit Profile (PUT /api/auth/profile)
          </button>

          <button
            onClick={() => setActiveTab("role")}
            style={{
              padding: "0.75rem 1.25rem",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "role" ? "2px solid var(--accent-emerald)" : "2px solid transparent",
              color: activeTab === "role" ? "#fff" : "var(--text-secondary)",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.95rem",
            }}
          >
            <Sliders size={16} /> Role &amp; Permissions
          </button>

          <button
            onClick={() => setActiveTab("security")}
            style={{
              padding: "0.75rem 1.25rem",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "security" ? "2px solid var(--accent-emerald)" : "2px solid transparent",
              color: activeTab === "security" ? "#fff" : "var(--text-secondary)",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.95rem",
            }}
          >
            <Lock size={16} /> Phase 1 Security Inspector
          </button>
        </div>

        {/* Tab 1: Edit Profile */}
        {activeTab === "profile" && (
          <div className="glass-card" style={{ padding: "2rem" }}>
            <div style={{ marginBottom: "1.75rem" }}>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "0.3rem" }}>Profile Information</h3>
              <p style={{ fontSize: "0.875rem" }}>
                Update your public profile, company branding, and acquisition focus.
              </p>
            </div>

            {successMessage && (
              <div className="alert alert-success" style={{ marginBottom: "1.5rem" }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <div>{successMessage}</div>
              </div>
            )}

            {errorMessage && (
              <div className="alert alert-danger" style={{ marginBottom: "1.5rem" }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <div>{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address (Read-only)</label>
                  <input
                    type="email"
                    disabled
                    className="form-input"
                    value={user?.email || ""}
                    style={{ opacity: 0.6, cursor: "not-allowed" }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Company / Firm Name</label>
                <input
                  type="text"
                  name="company"
                  className="form-input"
                  placeholder="e.g. Apex Capital"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bio / Investment Criteria</label>
                <textarea
                  name="bio"
                  rows={4}
                  className="form-textarea"
                  placeholder="Describe your acquisition criteria or business background..."
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" disabled={isUpdating} className="btn btn-primary">
                  {isUpdating ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> Saving Changes...
                    </>
                  ) : (
                    <>
                      Save Profile Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Role & Deal Flow Permissions */}
        {activeTab === "role" && (
          <div className="glass-card" style={{ padding: "2rem" }}>
            <div style={{ marginBottom: "1.75rem" }}>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "0.3rem" }}>Role Capabilities &amp; Access</h3>
              <p style={{ fontSize: "0.875rem" }}>
                Active role: <strong style={{ color: "#fff", textTransform: "capitalize" }}>{user?.role}</strong>
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
              <div
                style={{
                  background: user?.role === "buyer" ? "rgba(59, 130, 246, 0.1)" : "rgba(255, 255, 255, 0.02)",
                  border: `1px solid ${user?.role === "buyer" ? "#3b82f6" : "var(--border-subtle)"}`,
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
                  <TrendingUp size={20} style={{ color: "#60a5fa" }} />
                  <h4 style={{ margin: 0, fontSize: "1.1rem" }}>Buyer Permissions</h4>
                </div>
                <ul style={{ listStyle: "none", fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <li>✓ Browse confidential listing financials</li>
                  <li>✓ Execute one-click digital NDAs</li>
                  <li>✓ Direct messaging with sellers &amp; brokers</li>
                  <li>✓ Submit Letters of Intent (LOI)</li>
                </ul>
              </div>

              <div
                style={{
                  background: user?.role === "seller" ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.02)",
                  border: `1px solid ${user?.role === "seller" ? "#10b981" : "var(--border-subtle)"}`,
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
                  <DollarSign size={20} style={{ color: "#34d399" }} />
                  <h4 style={{ margin: 0, fontSize: "1.1rem" }}>Seller Permissions</h4>
                </div>
                <ul style={{ listStyle: "none", fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <li>✓ Create confidential business listings</li>
                  <li>✓ Approve or deny buyer NDA requests</li>
                  <li>✓ Escrow &amp; transaction management</li>
                  <li>✓ AI Valuation benchmarking</li>
                </ul>
              </div>

              <div
                style={{
                  background: user?.role === "broker" ? "rgba(245, 158, 11, 0.1)" : "rgba(255, 255, 255, 0.02)",
                  border: `1px solid ${user?.role === "broker" ? "#f59e0b" : "var(--border-subtle)"}`,
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
                  <Briefcase size={20} style={{ color: "#fbbf24" }} />
                  <h4 style={{ margin: 0, fontSize: "1.1rem" }}>Broker Permissions</h4>
                </div>
                <ul style={{ listStyle: "none", fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <li>✓ Syndicate multi-client deal flow</li>
                  <li>✓ Co-broker deals &amp; split advisory fees</li>
                  <li>✓ Access verified buyer network</li>
                  <li>✓ Automated deal memo generation</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Phase 1 Security & Token Inspector */}
        {activeTab === "security" && (
          <div className="glass-card" style={{ padding: "2rem" }}>
            <div style={{ marginBottom: "1.75rem" }}>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "0.3rem" }}>Phase 1 Security &amp; Token Architecture</h3>
              <p style={{ fontSize: "0.875rem" }}>
                Live cryptographic verification of current authenticated session.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
              <div
                style={{
                  background: "rgba(10, 16, 29, 0.7)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "0.75rem",
                  padding: "1.25rem",
                }}
              >
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                  AUTH MECHANISM
                </div>
                <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#10b981", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <ShieldCheck size={18} /> HTTP-Only Secure Cookie
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.4rem" }}>
                  Cookie named <code>token</code> with <code>httpOnly: true</code>, <code>sameSite: lax</code>, 7-day expiration.
                </div>
              </div>

              <div
                style={{
                  background: "rgba(10, 16, 29, 0.7)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "0.75rem",
                  padding: "1.25rem",
                }}
              >
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
                  USER IDENTIFIER
                </div>
                <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#38bdf8", fontFamily: "var(--font-mono)" }}>
                  {user?.id || user?._id}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.4rem" }}>
                  MongoDB 24-character ObjectId sanitized via <code>toJSON()</code>
                </div>
              </div>
            </div>

            {/* Sanitized User Data */}
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>
                Sanitized User Payload (Password field safely omitted)
              </div>
              <pre
                style={{
                  background: "#050811",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "0.75rem",
                  padding: "1.25rem",
                  overflowX: "auto",
                  fontSize: "0.85rem",
                  fontFamily: "var(--font-mono)",
                  color: "#34d399",
                }}
              >
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
