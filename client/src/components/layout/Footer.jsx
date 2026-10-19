import { Link } from "react-router-dom";
import { Building2, ShieldCheck, Lock, Activity, CheckCircle2 } from "lucide-react";

export const Footer = () => {
  return (
    <footer
      style={{
        marginTop: "auto",
        background: "rgba(10, 16, 29, 0.95)",
        borderTop: "1px solid var(--border-subtle)",
        padding: "3.5rem 0 2rem",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand Info */}
          <div style={{ maxWidth: "340px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#070b14",
                }}
              >
                <Building2 size={18} strokeWidth={2.5} />
              </div>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.25rem", fontWeight: 800, color: "#fff" }}>
                Deal<span style={{ color: "var(--accent-emerald)" }}>Bridge</span>
              </span>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              The confidential marketplace bridging verified buyers, exiting founders, and licensed M&amp;A advisors for high-yield business acquisitions.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span className="badge badge-emerald">
                <ShieldCheck size={12} /> Confidential Escrow
              </span>
              <span className="badge badge-blue">
                <Lock size={12} /> Encrypted NDAs
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>Marketplace</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem" }}>
              <li>
                <Link to="/" style={{ color: "var(--text-secondary)" }}>
                  SaaS &amp; Tech Startups
                </Link>
              </li>
              <li>
                <Link to="/" style={{ color: "var(--text-secondary)" }}>
                  E-Commerce &amp; DTC
                </Link>
              </li>
              <li>
                <Link to="/" style={{ color: "var(--text-secondary)" }}>
                  B2B Services &amp; Agencies
                </Link>
              </li>
              <li>
                <Link to="/" style={{ color: "var(--text-secondary)" }}>
                  Proprietary Deal Flow
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Roles */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>User Ecosystem</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem" }}>
              <li>
                <Link to="/register" style={{ color: "var(--text-secondary)" }}>
                  Buyer Membership
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: "var(--text-secondary)" }}>
                  Seller Confidential Exit
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: "var(--text-secondary)" }}>
                  M&amp;A Broker Syndication
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: "var(--text-secondary)" }}>
                  Client Portal Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Architecture Phases */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>
              Project Phases
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "0.5rem",
                  padding: "0.6rem 0.8rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#34d399" }}>Phase 0</span>
                  <CheckCircle2 size={14} style={{ color: "#10b981" }} />
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Infrastructure, Health Check &amp; Express 5 DB Layer
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "0.5rem",
                  padding: "0.6rem 0.8rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#60a5fa" }}>Phase 1</span>
                  <CheckCircle2 size={14} style={{ color: "#3b82f6" }} />
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Auth, JWT Cookies, Multi-role (Buyer/Seller/Broker)
                </div>
              </div>

              <Link
                to="/health"
                style={{
                  fontSize: "0.8rem",
                  color: "var(--accent-cyan)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                <Activity size={14} /> Open Live Infrastructure Monitor
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
          }}
        >
          <div>&copy; {new Date().getFullYear()} DealBridge Technologies Inc. All rights reserved.</div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <span>Confidentiality &amp; NDAs</span>
            <span>Security Architecture</span>
            <span>API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
