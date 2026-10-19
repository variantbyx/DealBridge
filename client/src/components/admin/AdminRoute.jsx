import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { ShieldAlert, ArrowLeft, RefreshCw, Lock } from "lucide-react";

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
          <RefreshCw size={36} className="animate-spin" style={{ color: "var(--accent-emerald)", margin: "0 auto 1rem" }} />
          <div>Verifying administrative credentials &amp; permissions...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return (
      <div className="container" style={{ padding: "6rem 0", textAlign: "center" }}>
        <div
          className="glass-card"
          style={{
            maxWidth: "520px",
            margin: "0 auto",
            padding: "3rem 2rem",
            background: "rgba(14, 20, 36, 0.8)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.12)",
              border: "1.5px solid rgba(239, 68, 68, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
              color: "#ef4444",
            }}
          >
            <ShieldAlert size={34} />
          </div>

          <h2 style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>
            Access Restricted
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            The <strong>DealBridge Admin Portal</strong> is strictly restricted to authorized platform administrators.
            Your current account (<code style={{ color: "#38bdf8" }}>{user.email}</code>) has role <strong>{user.role}</strong>.
          </p>

          <div
            style={{
              padding: "0.85rem",
              borderRadius: "0.5rem",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-subtle)",
              fontSize: "0.825rem",
              color: "var(--text-secondary)",
              marginBottom: "1.75rem",
              textAlign: "left",
            }}
          >
            <div style={{ fontWeight: 600, color: "#fff", marginBottom: "0.25rem" }}>
              Need Admin Access?
            </div>
            Sign in with demo administrator credentials:
            <div style={{ fontFamily: "var(--font-mono)", color: "var(--accent-emerald)", marginTop: "0.2rem" }}>
              admin@dealbridge.io / Password123!
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <Link to="/" className="btn btn-secondary">
              <ArrowLeft size={16} /> Return to Homepage
            </Link>
            <Link to="/login" className="btn btn-primary">
              <Lock size={16} /> Sign in as Admin
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
