import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useHealth } from "../../context/HealthContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { HealthModal } from "../health/HealthModal.jsx";
import {
  Shield,
  Activity,
  User,
  LogOut,
  ChevronDown,
  Building2,
  Lock,
  Layers,
  Heart,
} from "lucide-react";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { health, isHealthy } = useHealth();
  const { wishlistCount } = useWishlist();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [healthModalOpen, setHealthModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate("/");
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "buyer":
        return <span className="badge badge-blue">Buyer</span>;
      case "seller":
        return <span className="badge badge-emerald">Seller</span>;
      case "broker":
        return <span className="badge badge-gold">Broker</span>;
      case "admin":
        return <span className="badge badge-purple">Admin</span>;
      default:
        return <span className="badge badge-blue">{role}</span>;
    }
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(7, 11, 20, 0.8)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "72px",
          }}
        >
          {/* Brand Logo */}
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#070b14",
                boxShadow: "0 4px 12px rgba(16, 185, 129, 0.35)",
              }}
            >
              <Building2 size={22} strokeWidth={2.5} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "1.35rem",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "#ffffff",
                  lineHeight: 1.1,
                }}
              >
                Deal<span style={{ color: "var(--accent-emerald)" }}>Bridge</span>
              </span>
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "var(--text-muted)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Affiliate Commerce &amp; Discovery
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.75rem",
            }}
          >
            <Link
              to="/products"
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: location.pathname === "/products" ? "var(--text-highlight)" : "var(--text-secondary)",
              }}
            >
              Browse Catalog
            </Link>
            <Link
              to="/wishlist"
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: location.pathname === "/wishlist" ? "var(--text-highlight)" : "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
              }}
            >
              <Heart
                size={16}
                fill={wishlistCount > 0 ? "#ef4444" : "none"}
                color={wishlistCount > 0 ? "#ef4444" : "currentColor"}
              />
              Wishlist
              {wishlistCount > 0 && (
                <span
                  style={{
                    background: "#ef4444",
                    color: "#ffffff",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    padding: "0.1rem 0.45rem",
                    borderRadius: "9999px",
                    lineHeight: 1.2,
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/health"
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: location.pathname === "/health" ? "var(--text-highlight)" : "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <Activity size={15} /> System Diagnostics
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: location.pathname === "/admin" ? "#d8b4fe" : "#c084fc",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.25rem 0.65rem",
                  borderRadius: "6px",
                  background: "rgba(168, 85, 247, 0.12)",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                }}
              >
                <Shield size={14} style={{ color: "#c084fc" }} /> Admin Portal
              </Link>
            )}
          </nav>

          {/* Right Action Elements: Phase 0 Indicator + Auth */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {/* Live Phase 0 Health Pill */}
            <button
              onClick={() => setHealthModalOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.55rem",
                padding: "0.4rem 0.85rem",
                background: "rgba(18, 28, 48, 0.6)",
                border: "1px solid var(--border-medium)",
                borderRadius: "9999px",
                cursor: "pointer",
                color: "var(--text-primary)",
                fontSize: "0.775rem",
                fontWeight: 600,
                transition: "all var(--transition-fast)",
              }}
              title="Click to view full Phase 0 backend diagnostics"
            >
              <span className={`status-dot ${isHealthy ? "status-dot-green" : "status-dot-red"}`} />
              <span style={{ color: isHealthy ? "#34d399" : "#f87171" }}>
                {isHealthy ? "Backend Online" : "System Alert"}
              </span>
              {health.latencyMs !== null && (
                <span style={{ color: "var(--text-muted)", fontSize: "0.725rem", borderLeft: "1px solid var(--border-subtle)", paddingLeft: "0.5rem" }}>
                  {health.latencyMs}ms
                </span>
              )}
            </button>

            {/* Auth Buttons or User Profile Dropdown */}
            {isAuthenticated && user ? (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--border-medium)",
                    padding: "0.35rem 0.75rem 0.35rem 0.4rem",
                    borderRadius: "9999px",
                    cursor: "pointer",
                    color: "var(--text-primary)",
                  }}
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt={user.name}
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1px solid var(--accent-emerald)",
                    }}
                  />
                  <div style={{ textAlign: "left", lineHeight: 1.2 }}>
                    <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "#fff" }}>
                      {user.name?.split(" ")[0]}
                    </div>
                  </div>
                  {getRoleBadge(user.role)}
                  <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="glass-card"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 8px)",
                      width: "240px",
                      padding: "0.6rem",
                      zIndex: 100,
                      background: "#0d1527",
                      border: "1px solid var(--border-medium)",
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    <div
                      style={{
                        padding: "0.6rem 0.8rem",
                        borderBottom: "1px solid var(--border-subtle)",
                        marginBottom: "0.4rem",
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff" }}>{user.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {user.email}
                      </div>
                      {user.company && (
                        <div style={{ fontSize: "0.75rem", color: "var(--accent-emerald)", marginTop: "2px" }}>
                          {user.company}
                        </div>
                      )}
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.55rem 0.8rem",
                        fontSize: "0.85rem",
                        color: "var(--text-primary)",
                        borderRadius: "0.375rem",
                        transition: "background var(--transition-fast)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <User size={16} style={{ color: "var(--accent-emerald)" }} />
                      My Account &amp; Profile
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.55rem 0.8rem",
                        fontSize: "0.85rem",
                        color: "var(--text-primary)",
                        borderRadius: "0.375rem",
                        transition: "background var(--transition-fast)",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <Heart size={16} style={{ color: "#ef4444" }} />
                        <span>My Saved Wishlist</span>
                      </div>
                      {wishlistCount > 0 && (
                        <span
                          style={{
                            background: "rgba(239, 68, 68, 0.2)",
                            color: "#ef4444",
                            border: "1px solid rgba(239, 68, 68, 0.4)",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            padding: "0.05rem 0.4rem",
                            borderRadius: "9999px",
                          }}
                        >
                          {wishlistCount}
                        </span>
                      )}
                    </Link>

                    {user.role === "admin" && (
                      <>
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.55rem 0.8rem",
                            fontSize: "0.85rem",
                            color: "#fff",
                            borderRadius: "0.375rem",
                            background: "rgba(168, 85, 247, 0.12)",
                            border: "1px solid rgba(168, 85, 247, 0.3)",
                            marginBottom: "0.35rem",
                            transition: "background var(--transition-fast)",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(168, 85, 247, 0.22)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(168, 85, 247, 0.12)")}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <Shield size={16} style={{ color: "#c084fc" }} />
                            <span style={{ fontWeight: 700 }}>Admin Console</span>
                          </div>
                          <span className="badge badge-purple" style={{ fontSize: "0.65rem", padding: "1px 5px" }}>
                            Master
                          </span>
                        </Link>

                        <Link
                          to="/admin/analytics"
                          onClick={() => setDropdownOpen(false)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.55rem 0.8rem",
                            fontSize: "0.85rem",
                            color: "#fff",
                            borderRadius: "0.375rem",
                            background: "rgba(6, 182, 212, 0.08)",
                            border: "1px solid rgba(6, 182, 212, 0.25)",
                            marginBottom: "0.35rem",
                            transition: "background var(--transition-fast)",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(6, 182, 212, 0.18)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(6, 182, 212, 0.08)")}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <BarChart3 size={16} style={{ color: "var(--accent-cyan)" }} />
                            <span style={{ fontWeight: 600 }}>Click Analytics</span>
                          </div>
                          <span className="badge badge-cyan" style={{ fontSize: "0.65rem", padding: "1px 5px" }}>
                            Module 6
                          </span>
                        </Link>
                      </>
                    )}

                    <Link
                      to="/health"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.55rem 0.8rem",
                        fontSize: "0.85rem",
                        color: "var(--text-primary)",
                        borderRadius: "0.375rem",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <Activity size={16} style={{ color: "var(--accent-cyan)" }} />
                      Infrastructure Health
                    </Link>

                    <div style={{ height: "1px", background: "var(--border-subtle)", margin: "0.4rem 0" }} />

                    <button
                      onClick={handleLogout}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        width: "100%",
                        padding: "0.55rem 0.8rem",
                        fontSize: "0.85rem",
                        color: "#f87171",
                        background: "transparent",
                        border: "none",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Health diagnostics modal */}
      <HealthModal isOpen={healthModalOpen} onClose={() => setHealthModalOpen(false)} />
    </>
  );
};
