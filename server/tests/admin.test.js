import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/models/User.js";
import Product from "../src/models/Product.js";
import Merchant from "../src/models/Merchant.js";
import MerchantOffer from "../src/models/MerchantOffer.js";
import { generateToken } from "../src/utils/token.js";

const TEST_MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dealbridge";

let adminToken = "";
let buyerToken = "";
let adminUser = null;
let buyerUser = null;
let testMerchant = null;
let createdProductId = "";
let createdOfferId = "";

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URI);
  }

  // Find or create admin user
  await User.deleteOne({ email: "test_admin@dealbridge.io" });
  adminUser = await User.create({
    name: "Test Admin",
    email: "test_admin@dealbridge.io",
    password: "Password123!",
    role: "admin",
  });
  adminToken = generateToken({ id: adminUser._id });

  // Find or create regular buyer user
  await User.deleteOne({ email: "test_buyer@dealbridge.io" });
  buyerUser = await User.create({
    name: "Test Buyer",
    email: "test_buyer@dealbridge.io",
    password: "Password123!",
    role: "buyer",
  });
  buyerToken = generateToken({ id: buyerUser._id });

  // Find or create a test merchant
  testMerchant = await Merchant.findOne();
  if (!testMerchant) {
    testMerchant = await Merchant.create({
      name: "Test Merchant Store",
      slug: "test-merchant-store",
      website: "https://www.example.com",
      trustScore: 95,
    });
  }
});

afterAll(async () => {
  if (createdProductId) {
    await Product.findByIdAndDelete(createdProductId);
    await MerchantOffer.deleteMany({ product: createdProductId });
  }
  await User.deleteMany({
    email: { $in: ["test_admin@dealbridge.io", "test_buyer@dealbridge.io"] },
  });
  await mongoose.disconnect();
});

describe("Module 5: Admin Dashboard & Catalog Management", () => {
  describe("Security and Role-Based Access Control", () => {
    it("POST /api/products should reject unauthenticated requests with 401", async () => {
      const res = await request(app).post("/api/products").send({
        name: "Unauthorized Product",
        brand: "BrandX",
        model: "ModelX",
        modelNumber: "BX-100",
        category: "smartphones",
        description: "Test description",
      });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("POST /api/products should reject non-admin users with 403 Forbidden", async () => {
      const res = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${buyerToken}`)
        .send({
          name: "Buyer Attempt Product",
          brand: "BrandX",
          model: "ModelX",
          modelNumber: "BX-100",
          category: "smartphones",
          description: "Test description",
        });
      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("Forbidden");
    });

    it("GET /api/admin/stats should reject non-admin users with 403 Forbidden", async () => {
      const res = await request(app)
        .get("/api/admin/stats")
        .set("Authorization", `Bearer ${buyerToken}`);
      expect(res.status).toBe(403);
    });
  });

  describe("Product Management (Admin Operations)", () => {
    it("POST /api/products should allow admin to create a new canonical product", async () => {
      const res = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Admin Test Smartwatch Pro",
          brand: "Garmin",
          model: "Fenix 8",
          modelNumber: "GARMIN-F8-47",
          category: "watches",
          description: "Premium multisport GPS smartwatch with AMOLED display.",
          thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
          specifications: [
            { key: "Display", value: "1.4-inch AMOLED" },
            { key: "Battery Life", value: "Up to 16 days" },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.product.modelNumber).toBe("GARMIN-F8-47");
      expect(res.body.product.brand).toBe("Garmin");
      expect(res.body.product.canonicalKey).toBe("garmin:fenix8:garminf847");
      createdProductId = res.body.product.id;
    });

    it("POST /api/products should prevent duplicate canonical products with 409 Conflict", async () => {
      const res = await request(app)
        .post("/api/products")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Duplicate Garmin Watch",
          brand: "Garmin",
          model: "Fenix 8",
          modelNumber: "GARMIN-F8-47",
          category: "watches",
          description: "Duplicate attempt",
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("already exists");
    });

    it("PUT /api/products/:id should allow admin to edit product details", async () => {
      const res = await request(app)
        .put(`/api/products/${createdProductId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Admin Test Smartwatch Pro 2026 Edition",
          description: "Updated description for test smartwatch.",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.product.name).toBe("Admin Test Smartwatch Pro 2026 Edition");
      expect(res.body.product.description).toBe("Updated description for test smartwatch.");
    });

    it("PATCH /api/products/:id/availability should allow admin to toggle product availability", async () => {
      const res = await request(app)
        .patch(`/api/products/${createdProductId}/availability`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isAvailable).toBe(false);

      // Toggle back to true
      const res2 = await request(app)
        .patch(`/api/products/${createdProductId}/availability`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res2.status).toBe(200);
      expect(res2.body.isAvailable).toBe(true);
    });
  });

  describe("Merchant Offer Management & Pricing Resynchronization", () => {
    it("POST /api/products/:id/offers should add an offer and resynchronize product lowestPrice", async () => {
      const res = await request(app)
        .post(`/api/products/${createdProductId}/offers`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          merchantId: testMerchant._id.toString(),
          price: 799,
          originalPrice: 899,
          externalUrl: "https://www.amazon.com/dp/B0DFENtest",
          condition: "Brand New",
          shipping: "Free Expedited Delivery",
          inStock: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.offer.price).toBe(799);
      expect(res.body.product.lowestPrice).toBe(799);
      expect(res.body.product.offerCount).toBe(1);
      createdOfferId = res.body.offer.id;
    });

    it("PUT /api/offers/:id should update offer price and resync product lowestPrice", async () => {
      const res = await request(app)
        .put(`/api/offers/${createdOfferId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          price: 749,
          originalPrice: 899,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.offer.price).toBe(749);

      // Verify canonical product lowest price was updated
      const product = await Product.findById(createdProductId);
      expect(product.lowestPrice).toBe(749);
    });

    it("DELETE /api/offers/:id should delete offer and resync product pricing", async () => {
      const res = await request(app)
        .delete(`/api/offers/${createdOfferId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Check product pricing resynced to 0
      const product = await Product.findById(createdProductId);
      expect(product.lowestPrice).toBe(0);
      expect(product.offerCount).toBe(0);
    });
  });

  describe("Admin Statistics & Analytics", () => {
    it("GET /api/admin/stats should return catalog counters and click statistics", async () => {
      const res = await request(app)
        .get("/api/admin/stats")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats).toHaveProperty("totalProducts");
      expect(res.body.stats).toHaveProperty("activeProducts");
      expect(res.body.stats).toHaveProperty("totalOffers");
      expect(res.body.stats).toHaveProperty("totalClicks");
      expect(res.body.stats).toHaveProperty("mostClickedProducts");
      expect(res.body.stats).toHaveProperty("categoryDistribution");
      expect(res.body.stats.totalProducts).toBeGreaterThanOrEqual(1);
    });

    it("GET /api/admin/merchants should return all active merchants", async () => {
      const res = await request(app)
        .get("/api/admin/merchants")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.merchants)).toBe(true);
      expect(res.body.merchants.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Product Deletion", () => {
    it("DELETE /api/products/:id should allow admin to delete product and associated offers", async () => {
      const res = await request(app)
        .delete(`/api/products/${createdProductId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const deleted = await Product.findById(createdProductId);
      expect(deleted).toBeNull();
      createdProductId = ""; // Cleared
    });
  });
});
