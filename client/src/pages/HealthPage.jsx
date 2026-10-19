import { useState } from "react";
import { useHealth } from "../context/HealthContext.jsx";
import {
  Activity,
  Database,
  Server,
  Shield,
  Clock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Terminal,
  Layers,
  Copy,
  Check,
} from "lucide-react";

export const HealthPage = () => {
  const { health, loading, refreshHealth, isHealthy } = useHealth();
  const [copied, setCopied] = useState(false);

  const formatUptime = (sec) => {
    if (!sec) return "0s";
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(health, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: "3rem 0 5rem" }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <span className="badge badge-emerald">Phase 0: Infrastructure</span>
            <span className="badge badge-blue">Express 5 + MongoDB</span>
          </div>
          <h1>System Diagnostics &amp; Health</h1>
          <p style={{ fontSize: "1.1rem", maxWidth: "700px", marginTop: "0.5rem" }}>
            Real-time status monitoring of the DealBridge backend infrastructure, MongoDB connection state, security headers, and request latency.
          </p>
        </div>

        {/* Status Callout Banner */}
        <div
          className="glass-card"
          style={{
            padding: "1.5rem 2rem",
            marginBottom: "2rem",
            background: isHealthy ? "rgba(16, 185, 129, 0.07)" : "rgba(239, 68, 68, 0.07)",
            borderColor: isHealthy ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: isHealthy ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isHealthy ? "#10b981" : "#ef4444",
                border: `1px solid ${isHealthy ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
              }}
            >
              {isHealthy ? <CheckCircle2 size={30} /> : <AlertTriangle size={30} />}
            </div>
            <div>
              <div style={{ fontSize: "1.3rem", fontWeight: 700, color: isHealthy ? "#34d399" : "#f87171" }}>
                {isHealthy ? "Phase 0 Verification Passed" : "System Issue Detected"}
              </div>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>
                {isHealthy
                  ? "DealBridge API server is online and successfully connected to the MongoDB database cluster."
                  : health.error || "Cannot establish connection with the database"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={refreshHealth}
              disabled={loading}
              className="btn btn-primary"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              {loading ? "Pinging API..." : "Ping /api/health"}
            </button>
          </div>
        </div>

        {/* 4 Diagnostic Stat Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {/* Card 1: API Status */}
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>API STATUS</span>
              <Server size={18} style={{ color: "#38bdf8" }} />
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: isHealthy ? "#10b981" : "#ef4444" }}>
              {health.status?.toUpperCase() || "UNKNOWN"}
            </div>
            <div style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              Endpoint: <code>GET /api/health</code> (200 OK)
            </div>
          </div>

          {/* Card 2: MongoDB Status */}
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>MONGODB CLUSTER</span>
              <Database size={18} style={{ color: "#10b981" }} />
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: health.database?.status === "connected" ? "#10b981" : "#ef4444" }}>
              {health.database?.status ? health.database.status.toUpperCase() : "OFFLINE"}
            </div>
            <div style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              ReadyState: {health.database?.readyState ?? 0} (Mongoose v9)
            </div>
          </div>

          {/* Card 3: Roundtrip Latency */}
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>LATENCY</span>
              <Activity size={18} style={{ color: "#f59e0b" }} />
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f59e0b" }}>
              {health.latencyMs !== null ? `${health.latencyMs} ms` : "--"}
            </div>
            <div style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              Client to server roundtrip via Vite proxy
            </div>
          </div>

          {/* Card 4: Uptime */}
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>SERVER UPTIME</span>
              <Clock size={18} style={{ color: "#a855f7" }} />
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#a855f7" }}>
              {formatUptime(health.uptimeSeconds)}
            </div>
            <div style={{ fontSize: "0.825rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
              {health.uptimeSeconds} elapsed seconds
            </div>
          </div>
        </div>

        {/* Visual Architecture Flow */}
        <div className="glass-card" style={{ padding: "2rem", marginBottom: "2.5rem" }}>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Phase 0 &amp; 1 Architecture Stack</h3>
          <p style={{ fontSize: "0.9rem", marginBottom: "1.75rem" }}>
            End-to-end data flow and verified layers of DealBridge
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.25rem",
              position: "relative",
            }}
          >
            {/* Layer 1: Client */}
            <div
              style={{
                background: "rgba(10, 16, 29, 0.8)",
                border: "1px solid var(--border-medium)",
                borderRadius: "0.75rem",
                padding: "1.25rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <span className="badge badge-blue">Layer 1</span>
                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>React 19 Frontend</span>
              </div>
              <ul style={{ listStyle: "none", fontSize: "0.825rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <li>✓ Vite 8.3 Dev Server (Port 5173)</li>
                <li>✓ Axios Client with Credentials</li>
                <li>✓ AuthContext &amp; HealthContext</li>
                <li>✓ Outfit &amp; Plus Jakarta Sans UI</li>
              </ul>
            </div>

            {/* Layer 2: Proxy & Security */}
            <div
              style={{
                background: "rgba(10, 16, 29, 0.8)",
                border: "1px solid var(--border-medium)",
                borderRadius: "0.75rem",
                padding: "1.25rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <span className="badge badge-emerald">Layer 2</span>
                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Express 5 Gateway</span>
              </div>
              <ul style={{ listStyle: "none", fontSize: "0.825rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <li>✓ Helmet Security Headers</li>
                <li>✓ CORS Whitelist with Credentials</li>
                <li>✓ Cookie-Parser &amp; Body Parsers</li>
                <li>✓ Sensitive Auth Rate Limiter</li>
              </ul>
            </div>

            {/* Layer 3: Auth & Business Logic */}
            <div
              style={{
                background: "rgba(10, 16, 29, 0.8)",
                border: "1px solid var(--border-medium)",
                borderRadius: "0.75rem",
                padding: "1.25rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <span className="badge badge-gold">Layer 3</span>
                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Phase 1 Auth API</span>
              </div>
              <ul style={{ listStyle: "none", fontSize: "0.825rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <li>✓ JWT Tokens (Cookie + Bearer)</li>
                <li>✓ Bcrypt Salted Password Hash</li>
                <li>✓ Zod Payload Validation</li>
                <li>✓ Multi-role (Buyer/Seller/Broker)</li>
              </ul>
            </div>

            {/* Layer 4: Storage */}
            <div
              style={{
                background: "rgba(10, 16, 29, 0.8)",
                border: "1px solid var(--border-medium)",
                borderRadius: "0.75rem",
                padding: "1.25rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <span className="badge badge-purple">Layer 4</span>
                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>MongoDB Cluster</span>
              </div>
              <ul style={{ listStyle: "none", fontSize: "0.825rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <li>✓ Mongoose Schema &amp; Indexes</li>
                <li>✓ Graceful Connection Lifecycle</li>
                <li>✓ Unique Constraint on Emails</li>
                <li>✓ Local MongoDB Server (Port 27017)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Live Payload Viewer */}
        <div className="glass-card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Terminal size={18} style={{ color: "var(--accent-emerald)" }} />
              <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Raw Response: GET /api/health</h3>
            </div>
            <button
              onClick={handleCopyJson}
              className="btn btn-secondary btn-sm"
              style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
              {copied ? <Check size={14} style={{ color: "#10b981" }} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy JSON"}
            </button>
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
              color: "#38bdf8",
              lineHeight: 1.6,
            }}
          >
            {JSON.stringify(health, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
