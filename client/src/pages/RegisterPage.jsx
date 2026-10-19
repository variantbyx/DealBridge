import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  User,
  Mail,
  Lock,
  Building2,
  FileText,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  TrendingUp,
  DollarSign,
  RefreshCw,
} from "lucide-react";

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
    company: "",
    bio: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError("");
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const getPasswordStrength = () => {
    const pw = formData.password;
    if (!pw) return { level: 0, text: "", color: "" };
    if (pw.length < 6) return { level: 1, text: "Too short (min 6 chars)", color: "#ef4444" };
    if (pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw)) {
      return { level: 3, text: "Strong password", color: "#10b981" };
    }
    return { level: 2, text: "Good", color: "#f59e0b" };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!formData.name || formData.name.length < 2) {
      setLocalError("Name must be at least 2 characters.");
      return;
    }
    if (!formData.email || !formData.email.includes("@")) {
      setLocalError("Please enter a valid email address.");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    const result = await register(formData);
    setIsSubmitting(false);

    if (result.success) {
      navigate("/profile", { replace: true });
    } else {
      setLocalError(result.message || "Registration failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 72px - 250px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3.5rem 1.5rem",
      }}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "2.5rem",
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
            <ShieldCheck size={26} strokeWidth={2.5} />
          </div>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "0.4rem" }}>Join DealBridge</h2>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            Create your account to start reviewing deals or listing your business
          </p>
        </div>

        {/* Error Alert */}
        {localError && (
          <div className="alert alert-danger" style={{ marginBottom: "1.5rem" }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>{localError}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Role Selection Cards */}
          <div>
            <label className="form-label" style={{ marginBottom: "0.6rem" }}>
              Select Your Primary Role
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
              {/* Buyer */}
              <div
                onClick={() => handleRoleSelect("buyer")}
                style={{
                  padding: "0.85rem 0.6rem",
                  borderRadius: "0.75rem",
                  cursor: "pointer",
                  textAlign: "center",
                  background:
                    formData.role === "buyer"
                      ? "rgba(59, 130, 246, 0.15)"
                      : "rgba(255, 255, 255, 0.03)",
                  border: `1.5px solid ${
                    formData.role === "buyer" ? "#3b82f6" : "var(--border-subtle)"
                  }`,
                  transition: "all var(--transition-fast)",
                }}
              >
                <div style={{ color: formData.role === "buyer" ? "#60a5fa" : "var(--text-muted)", marginBottom: "0.3rem" }}>
                  <TrendingUp size={22} style={{ margin: "0 auto" }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: formData.role === "buyer" ? "#fff" : "var(--text-secondary)" }}>
                  Buyer
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  Acquire Deals
                </div>
              </div>

              {/* Seller */}
              <div
                onClick={() => handleRoleSelect("seller")}
                style={{
                  padding: "0.85rem 0.6rem",
                  borderRadius: "0.75rem",
                  cursor: "pointer",
                  textAlign: "center",
                  background:
                    formData.role === "seller"
                      ? "rgba(16, 185, 129, 0.15)"
                      : "rgba(255, 255, 255, 0.03)",
                  border: `1.5px solid ${
                    formData.role === "seller" ? "#10b981" : "var(--border-subtle)"
                  }`,
                  transition: "all var(--transition-fast)",
                }}
              >
                <div style={{ color: formData.role === "seller" ? "#34d399" : "var(--text-muted)", marginBottom: "0.3rem" }}>
                  <DollarSign size={22} style={{ margin: "0 auto" }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: formData.role === "seller" ? "#fff" : "var(--text-secondary)" }}>
                  Seller
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  Exit Business
                </div>
              </div>

              {/* Broker */}
              <div
                onClick={() => handleRoleSelect("broker")}
                style={{
                  padding: "0.85rem 0.6rem",
                  borderRadius: "0.75rem",
                  cursor: "pointer",
                  textAlign: "center",
                  background:
                    formData.role === "broker"
                      ? "rgba(245, 158, 11, 0.15)"
                      : "rgba(255, 255, 255, 0.03)",
                  border: `1.5px solid ${
                    formData.role === "broker" ? "#f59e0b" : "var(--border-subtle)"
                  }`,
                  transition: "all var(--transition-fast)",
                }}
              >
                <div style={{ color: formData.role === "broker" ? "#fbbf24" : "var(--text-muted)", marginBottom: "0.3rem" }}>
                  <Briefcase size={22} style={{ margin: "0 auto" }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: formData.role === "broker" ? "#fff" : "var(--text-secondary)" }}>
                  Broker
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  M&amp;A Advisor
                </div>
              </div>
            </div>
          </div>

          {/* Full Name & Email */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  name="name"
                  required
                  className="form-input"
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Work Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  name="email"
                  required
                  className="form-input"
                  placeholder="alex@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="form-label">
              <span>Password</span>
              {strength.text && (
                <span style={{ fontSize: "0.75rem", color: strength.color }}>
                  {strength.text}
                </span>
              )}
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="form-input"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
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

          {/* Company */}
          <div className="form-group">
            <label className="form-label">Company / Fund Name (Optional)</label>
            <div className="input-with-icon">
              <Building2 size={18} className="input-icon" />
              <input
                type="text"
                name="company"
                className="form-input"
                placeholder="e.g. Apex Capital Partners"
                value={formData.company}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Bio / Criteria */}
          <div className="form-group">
            <label className="form-label">
              {formData.role === "buyer"
                ? "Acquisition Criteria / Bio"
                : formData.role === "seller"
                ? "Business Summary / Industry"
                : "Firm Profile / Specialization"}
            </label>
            <textarea
              name="bio"
              className="form-textarea"
              rows={3}
              placeholder={
                formData.role === "buyer"
                  ? "Targeting B2B SaaS with ARR > $1M, EBITDA positive..."
                  : formData.role === "seller"
                  ? "Bootstrapped cloud software platform operating 4+ years..."
                  : "M&A advisory representing founder-led software and healthcare exits..."
              }
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem" }}
          >
            {isSubmitting ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Creating Account...
              </>
            ) : (
              <>
                Complete Registration <ArrowRight size={16} />
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
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent-emerald)", fontWeight: 700 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
