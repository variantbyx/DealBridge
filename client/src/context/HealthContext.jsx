import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { healthAPI } from "../services/api.js";

const HealthContext = createContext(null);

export const HealthProvider = ({ children }) => {
  const [health, setHealth] = useState({
    status: "checking",
    database: { status: "checking", readyState: 0 },
    uptimeSeconds: 0,
    service: "DealBridge API",
    latencyMs: null,
    lastChecked: null,
    error: null,
  });
  const [loading, setLoading] = useState(false);

  const checkHealth = useCallback(async () => {
    setLoading(true);
    try {
      const data = await healthAPI.getHealth();
      setHealth({
        status: data.status || "ok",
        database: data.database || { status: "unknown" },
        uptimeSeconds: data.uptimeSeconds || 0,
        service: data.service || "DealBridge API",
        version: data.version || "1.0.0",
        timestamp: data.timestamp,
        latencyMs: data.latencyMs,
        lastChecked: new Date(),
        error: null,
      });
    } catch (err) {
      setHealth((prev) => ({
        ...prev,
        status: "error",
        database: { status: "disconnected", readyState: 0 },
        latencyMs: null,
        lastChecked: new Date(),
        error: err.response?.data?.message || err.message || "Failed to reach API server",
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    // Poll every 45 seconds to keep health status fresh
    const interval = setInterval(checkHealth, 45000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  const value = {
    health,
    loading,
    refreshHealth: checkHealth,
    isHealthy: health.status === "ok" && health.database.status === "connected",
  };

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error("useHealth must be used within a HealthProvider");
  }
  return context;
};
