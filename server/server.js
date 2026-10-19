import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`[DealBridge Server] Running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
      console.log(`[DealBridge Server] Health check available at http://localhost:${PORT}/api/health`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error(`[Unhandled Rejection]: ${err.message}`);
      server.close(() => process.exit(1));
    });

    // Graceful shutdown on SIGTERM / SIGINT
    const shutdown = () => {
      console.log("[DealBridge Server] Shutting down gracefully...");
      server.close(() => {
        console.log("[DealBridge Server] Closed active HTTP connections.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error(`[Server Start Error]: ${error.message}`);
    process.exit(1);
  }
};

startServer();
