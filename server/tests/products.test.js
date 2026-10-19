import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import Product from "../src/models/Product.js";
import MerchantOffer from "../src/models/MerchantOffer.js";
import ClickEvent from "../src/models/ClickEvent.js";

const TEST_MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dealbridge";

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URI);
  }
});

afterAll(async () => {
  // Disconnect after tests
  await mongoose.disconnect();
});

describe("Module 1: Product Discovery & Catalog APIs", () => {
  it("GET /api/products should return paginated products with facets", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBeGreaterThan(0);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("currentPage");
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body.facets).toHaveProperty("brands");

    const sample = res.body.products[0];
    expect(sample).toHaveProperty("name");
    expect(sample).toHaveProperty("brand");
    expect(sample).toHaveProperty("category");
    expect(sample).toHaveProperty("lowestPrice");
  });

  it("GET /api/products?search=iPhone should return matching products", async () => {
    const res = await request(app).get("/api/products?search=iPhone");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.products.length).toBeGreaterThan(0);
    expect(
      res.body.products.some((p) => p.name.toLowerCase().includes("iphone"))
    ).toBe(true);
  });

  it("GET /api/products?category=smartphones should filter by category", async () => {
    const res = await request(app).get("/api/products?category=smartphones");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.products.length).toBeGreaterThan(0);
    expect(res.body.products.every((p) => p.category === "smartphones")).toBe(true);
  });

  it("GET /api/products?sort=price_asc should sort by lowestPrice ascending", async () => {
    const res = await request(app).get("/api/products?sort=price_asc&limit=10");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const prices = res.body.products.map((p) => p.lowestPrice);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  it("GET /api/products/categories should return category summary list", async () => {
    const res = await request(app).get("/api/products/categories");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(res.body.categories.length).toBe(6);
    expect(res.body.categories.some((c) => c.id === "watches")).toBe(true);
  });
});

describe("Module 2: Product Details & Merchant Offers", () => {
  it("GET /api/products/:slug should retrieve canonical product with merchant offers", async () => {
    const res = await request(app).get("/api/products/apple-iphone-16-pro-max-256gb");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.product).toBeDefined();
    expect(res.body.product.brand).toBe("Apple");
    expect(res.body.product.category).toBe("smartphones");

    // Check offers
    expect(Array.isArray(res.body.product.offers)).toBe(true);
    expect(res.body.product.offers.length).toBeGreaterThan(0);

    // Check lowest price is tagged
    const lowestOffer = res.body.product.offers[0];
    expect(lowestOffer.isLowestPrice).toBe(true);
    expect(res.body.product.lowestPrice).toBe(lowestOffer.price);
  });

  it("GET /api/products/non-existent-product-xyz should return 404", async () => {
    const res = await request(app).get("/api/products/non-existent-product-xyz");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe("Module 3: External Merchant Redirection & Click Tracking", () => {
  it("GET /api/redirect/:offerId should record ClickEvent and send HTTP 302 redirect", async () => {
    const offer = await MerchantOffer.findOne({ inStock: true });
    expect(offer).toBeDefined();

    const initialClickCount = await ClickEvent.countDocuments({ offer: offer._id });

    const res = await request(app).get(`/api/redirect/${offer._id}`);
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe(offer.externalUrl);

    // Wait 200ms for async click tracking
    await new Promise((r) => setTimeout(r, 200));

    const finalClickCount = await ClickEvent.countDocuments({ offer: offer._id });
    expect(finalClickCount).toBe(initialClickCount + 1);
  });

  it("GET /api/redirect/:offerId with format=json should return redirect payload", async () => {
    const offer = await MerchantOffer.findOne({ inStock: true });
    const res = await request(app)
      .get(`/api/redirect/${offer._id}?format=json`)
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.redirectUrl).toBe(offer.externalUrl);
  });

  it("GET /api/redirect/invalid-id should return 400 Bad Request", async () => {
    const res = await request(app).get("/api/redirect/invalid-id");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
