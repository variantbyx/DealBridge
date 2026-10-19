import { useHealth } from "../../context/HealthContext.jsx";
import { Activity, Database, Server, Clock, RefreshCw, X, ShieldCheck, AlertTriangle } from "lucide-react";

export const HealthModal = ({ isOpen, onClose }) => {
  const { health, loading, refreshHealth, isHealthy } = useHealth();

  if (!isOpen) return null;

  const formatUptime = (sec) => {
    if (!sec) return "0s";
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "rgba(3, 7, 18, 0.75)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "560px",
          background: "#0d1527",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
          padding: "1.75rem",
          borderRadius: "1.25rem",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: isHealthy ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isHealthy ? "#10b981" : "#ef4444",
                border: `1px solid ${isHealthy ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
              }}
            >
              <Activity size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Phase 0 Infrastructure</h3>
              <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", margin: 0 }}>
                DealBridge Backend & Database Diagnostics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "0.25rem",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Status Hero Banner */}
        <div
          style={{
            padding: "1rem 1.25rem",
            borderRadius: "0.75rem",
            background: isHealthy ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
            border: `1px solid ${isHealthy ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {isHealthy ? (
              <ShieldCheck size={24} style={{ color: "#10b981" }} />
            ) : (
              <AlertTriangle size={24} style={{ color: "#ef4444" }} />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: isHealthy ? "#34d399" : "#f87171" }}>
                {isHealthy ? "All Systems Operational" : "Service Issue Detected"}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                {isHealthy
                  ? "Express 5 API and MongoDB cluster communicating normally"
                  : health.error || "Unable to reach database"}
              </div>
            </div>
          </div>
          <span className={`badge ${isHealthy ? "badge-emerald" : "badge-red"}`}>
            {health.status?.toUpperCase() || "UNKNOWN"}
          </span>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          {/* Database */}
          <div
            style={{
              background: "rgba(10, 16, 29, 0.6)",
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
              <Database size={15} /> MongoDB Connection
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: health.database?.status === "connected" ? "#10b981" : "#ef4444" }}>
              {health.database?.status ? health.database.status.toUpperCase() : "DISCONNECTED"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              ReadyState: {health.database?.readyState ?? 0} (1 = Active)
            </div>
          </div>

          {/* Latency */}
          <div
            style={{
              background: "rgba(10, 16, 29, 0.6)",
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
              <Activity size={15} /> API Latency
            </div>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#06b6d4" }}>
              {health.latencyMs !== null ? `${health.latencyMs} ms` : "--"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Roundtrip ping via `/api/health`
            </div>
          </div>

          {/* Service Info */}
          <div
            style={{
              background: "rgba(10, 16, 29, 0.6)",
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
              <Server size={15} /> Service Identity
            </div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {health.service || "DealBridge API"}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              v{health.version || "1.0.0"} · Node Express 5
            </div>
          </div>

          {/* Uptime */}
          <div
            style={{
              background: "rgba(10, 16, 29, 0.6)",
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
              <Clock size={15} /> Process Uptime
            </div>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text-primary)" }}>
              {formatUptime(health.uptimeSeconds)}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Continuous server execution
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Endpoint: <code style={{ color: "#38bdf8", background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: "4px" }}>GET /api/health</code>
          </span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={refreshHealth}
              disabled={loading}
              className="btn btn-secondary btn-sm"
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              {loading ? "Testing..." : "Ping Now"}
            </button>
            <button onClick={onClose} className="btn btn-primary btn-sm">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
