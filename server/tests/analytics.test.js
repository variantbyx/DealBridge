import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/models/User.js";
import Product from "../src/models/Product.js";
import MerchantOffer from "../src/models/MerchantOffer.js";
import ClickEvent from "../src/models/ClickEvent.js";
import { generateToken } from "../src/utils/token.js";

const TEST_MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dealbridge";

let adminToken = "";
let buyerToken = "";
let adminUser = null;
let buyerUser = null;
let sampleOffer = null;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URI);
  }

  // Find or create admin user
  await User.deleteOne({ email: "analytics_admin@dealbridge.io" });
  adminUser = await User.create({
    name: "Analytics Admin",
    email: "analytics_admin@dealbridge.io",
    password: "Password123!",
    role: "admin",
  });
  adminToken = generateToken({ id: adminUser._id });

  // Find or create buyer user
  await User.deleteOne({ email: "analytics_buyer@dealbridge.io" });
  buyerUser = await User.create({
    name: "Analytics Buyer",
    email: "analytics_buyer@dealbridge.io",
    password: "Password123!",
    role: "buyer",
  });
  buyerToken = generateToken({ id: buyerUser._id });

  // Find a sample offer for testing live click tracking
  sampleOffer = await MerchantOffer.findOne({ inStock: true, isActive: true });
});

afterAll(async () => {
  await User.deleteMany({
    email: { $in: ["analytics_admin@dealbridge.io", "analytics_buyer@dealbridge.io"] },
  });
  await mongoose.disconnect();
});

describe("Module 6: Basic Analytics & Click Telemetry", () => {
  describe("Security and Access Restrictions", () => {
    it("GET /api/admin/analytics should reject unauthenticated requests with 401", async () => {
      const res = await request(app).get("/api/admin/analytics");
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("GET /api/admin/analytics should reject non-admin users with 403 Forbidden", async () => {
      const res = await request(app)
        .get("/api/admin/analytics")
        .set("Authorization", `Bearer ${buyerToken}`);
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Forbidden");
    });
  });

  describe("Stored Application Data Aggregation", () => {
    it("GET /api/admin/analytics should return calculated statistics from MongoDB", async () => {
      const res = await request(app)
        .get("/api/admin/analytics")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const { stats } = res.body;
      expect(stats).toBeDefined();

      // Verify core counters are positive numbers populated from stored application data
      expect(typeof stats.totalProducts).toBe("number");
      expect(stats.totalProducts).toBeGreaterThanOrEqual(10);
      expect(typeof stats.totalOffers).toBe("number");
      expect(stats.totalOffers).toBeGreaterThanOrEqual(10);
      expect(typeof stats.totalClicks).toBe("number");
      expect(stats.totalClicks).toBeGreaterThanOrEqual(0);

      // Verify rankings and aggregations
      expect(Array.isArray(stats.mostClickedProducts)).toBe(true);
      expect(Array.isArray(stats.mostClickedMerchants)).toBe(true);
      expect(Array.isArray(stats.categoryDistribution)).toBe(true);
      expect(Array.isArray(stats.recentClicks)).toBe(true);
    });

    it("GET /api/admin/stats should be an alias returning identical payload", async () => {
      const res = await request(app)
        .get("/api/admin/stats")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats).toHaveProperty("totalProducts");
      expect(res.body.stats).toHaveProperty("totalClicks");
    });
  });

  describe("Dynamic Live Telemetry Updates", () => {
    it("Should record ClickEvent and dynamically increment analytics totalClicks without hardcoding", async () => {
      if (!sampleOffer) {
        console.warn("No active offer found to test live click telemetry");
        return;
      }

      // 1. Get baseline click count
      const initialRes = await request(app)
        .get("/api/admin/analytics")
        .set("Authorization", `Bearer ${adminToken}`);
      const initialClicks = initialRes.body.stats.totalClicks;

      // 2. Simulate an outbound redirect click on sampleOffer
      const redirectRes = await request(app)
        .get(`/api/redirect/${sampleOffer._id}`)
        .set("User-Agent", "DealBridgeTest/1.0");

      expect([302, 200]).toContain(redirectRes.status);

      // 3. Allow small async buffer for background click event write
      await new Promise((r) => setTimeout(r, 200));

      // 4. Verify ClickEvent exists in MongoDB
      const recorded = await ClickEvent.findOne({ offer: sampleOffer._id }).sort({ createdAt: -1 });
      expect(recorded).toBeDefined();
      expect(recorded.product.toString()).toBe(sampleOffer.product.toString());

      // 5. Re-query analytics endpoint to confirm dynamic calculation
      const updatedRes = await request(app)
        .get("/api/admin/analytics")
        .set("Authorization", `Bearer ${adminToken}`);

      const updatedClicks = updatedRes.body.stats.totalClicks;
      expect(updatedClicks).toBeGreaterThanOrEqual(initialClicks + 1);

      // Clean up test click
      await ClickEvent.findByIdAndDelete(recorded._id);
    });
  });
});
