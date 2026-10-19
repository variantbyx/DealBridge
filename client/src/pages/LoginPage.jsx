import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Building2,
  AlertCircle,
  RefreshCw,
  UserCheck,
} from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/profile";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !password) {
      setLocalError("Please provide both email and password.");
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setLocalError(result.message || "Failed to log in");
    }
  };

  const handleQuickLogin = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword("Password123!");
    setLocalError("");
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 72px - 250px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
      }}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "2.5rem 2rem",
          background: "#0c1424",
          border: "1px solid var(--border-medium)",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#070b14",
              marginBottom: "1rem",
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
            }}
          >
            <Lock size={24} strokeWidth={2.5} />
          </div>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Welcome Back</h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Access confidential deal flow and verified transactions
          </p>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div
          style={{
            background: "rgba(16, 185, 129, 0.05)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: "0.75rem",
            padding: "0.85rem",
            marginBottom: "1.75rem",
          }}
        >
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#34d399", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            ⚡ 1-Click Demo Accounts (Phase 1)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.4rem" }}>
            <button
              type="button"
              onClick={() => handleQuickLogin("alex@dealbridge.io", "buyer")}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: "0.75rem", padding: "0.4rem 0.2rem" }}
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("sarah@dealbridge.io", "seller")}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: "0.75rem", padding: "0.4rem 0.2rem" }}
            >
              Seller
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("david@dealbridge.io", "broker")}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: "0.75rem", padding: "0.4rem 0.2rem" }}
            >
              Broker
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {localError && (
          <div className="alert alert-danger" style={{ marginBottom: "1.5rem" }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>{localError}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                className="form-input"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label">
              <span>Password</span>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-action"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem" }}
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Signing in...
              </>
            ) : (
              <>
                Sign In to DealBridge <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div
          style={{
            marginTop: "1.75rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--border-subtle)",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
          }}
        >
          Don't have an account yet?{" "}
          <Link to="/register" style={{ color: "var(--accent-emerald)", fontWeight: 700 }}>
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
