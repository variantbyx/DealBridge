import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import redirectRoutes from "./routes/redirectRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Cross-Origin Resource Sharing
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in development
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Body parsers
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

// Health check endpoint (Phase 0 requirement)
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  res.status(200).json({
    status: "ok",
    service: "DealBridge API",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatusMap[dbState] || "unknown",
      readyState: dbState,
    },
    version: "1.0.0",
  });
});

// Phase 1: Authentication Routes
app.use("/api/auth", authRoutes);

// Module 1 & 2: Products & Offers Routes
app.use("/api/products", productRoutes);

// Module 3: External Merchant Redirection & Tracking
app.use("/api/redirect", redirectRoutes);

// Module 4: Wishlist Routes (Protected)
app.use("/api/wishlist", wishlistRoutes);

// Module 5 & 6: Admin Dashboard & Analytics (Admin Protected)
app.use("/api/offers", offerRoutes);
app.use("/api/admin", adminRoutes);

// 404 & Centralized Error Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
