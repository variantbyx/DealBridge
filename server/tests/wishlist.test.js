import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/models/User.js";
import Product from "../src/models/Product.js";
import Wishlist from "../src/models/Wishlist.js";

const TEST_MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dealbridge";

let userTokenA = "";
let userTokenB = "";
let testProduct1 = null;
let testProduct2 = null;

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URI);
  }

  // Find or use products
  testProduct1 = await Product.findOne();
  testProduct2 = await Product.findOne({ _id: { $ne: testProduct1._id } });

  // Create User A
  await User.deleteOne({ email: "wishlist_user_a@test.com" });
  const resA = await request(app).post("/api/auth/register").send({
    name: "User Alpha",
    email: "wishlist_user_a@test.com",
    password: "Password123!",
  });
  userTokenA = resA.body.token;

  // Create User B
  await User.deleteOne({ email: "wishlist_user_b@test.com" });
  const resB = await request(app).post("/api/auth/register").send({
    name: "User Beta",
    email: "wishlist_user_b@test.com",
    password: "Password123!",
  });
  userTokenB = resB.body.token;
});

beforeEach(async () => {
  // Clear wishlists for test users before each test
  const userA = await User.findOne({ email: "wishlist_user_a@test.com" });
  const userB = await User.findOne({ email: "wishlist_user_b@test.com" });
  if (userA) await Wishlist.deleteMany({ user: userA._id });
  if (userB) await Wishlist.deleteMany({ user: userB._id });
});

afterAll(async () => {
  await User.deleteMany({ email: { $in: ["wishlist_user_a@test.com", "wishlist_user_b@test.com"] } });
  await mongoose.disconnect();
});

describe("Module 4: User Authentication and Wishlist", () => {
  it("GET /api/wishlist should reject unauthenticated requests with 401", async () => {
    const res = await request(app).get("/api/wishlist");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/wishlist/:productId should add product to authenticated user's wishlist", async () => {
    const res = await request(app)
      .post(`/api/wishlist/${testProduct1._id}`)
      .set("Authorization", `Bearer ${userTokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(res.body.wishlist[0].id).toBe(testProduct1._id.toString());
  });

  it("POST /api/wishlist/:productId should prevent duplicate additions of same product", async () => {
    // Add once
    await request(app)
      .post(`/api/wishlist/${testProduct1._id}`)
      .set("Authorization", `Bearer ${userTokenA}`);

    // Add again
    const res = await request(app)
      .post(`/api/wishlist/${testProduct1._id}`)
      .set("Authorization", `Bearer ${userTokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
  });

  it("GET /api/wishlist/ids should return array of product IDs", async () => {
    await request(app)
      .post(`/api/wishlist/${testProduct1._id}`)
      .set("Authorization", `Bearer ${userTokenA}`);

    const res = await request(app)
      .get("/api/wishlist/ids")
      .set("Authorization", `Bearer ${userTokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.productIds).toContain(testProduct1._id.toString());
  });

  it("DELETE /api/wishlist/:productId should remove product from wishlist", async () => {
    // Add 2 products
    await request(app)
      .post(`/api/wishlist/${testProduct1._id}`)
      .set("Authorization", `Bearer ${userTokenA}`);
    await request(app)
      .post(`/api/wishlist/${testProduct2._id}`)
      .set("Authorization", `Bearer ${userTokenA}`);

    // Remove product 1
    const res = await request(app)
      .delete(`/api/wishlist/${testProduct1._id}`)
      .set("Authorization", `Bearer ${userTokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(1);
    expect(res.body.wishlist[0].id).toBe(testProduct2._id.toString());
  });

  it("Data Isolation: User A cannot see or access User B's wishlist", async () => {
    // User A adds product 1
    await request(app)
      .post(`/api/wishlist/${testProduct1._id}`)
      .set("Authorization", `Bearer ${userTokenA}`);

    // User B adds product 2
    await request(app)
      .post(`/api/wishlist/${testProduct2._id}`)
      .set("Authorization", `Bearer ${userTokenB}`);

    // User A checks wishlist -> should only contain product 1
    const resA = await request(app)
      .get("/api/wishlist")
      .set("Authorization", `Bearer ${userTokenA}`);
    expect(resA.body.count).toBe(1);
    expect(resA.body.wishlist[0].id).toBe(testProduct1._id.toString());

    // User B checks wishlist -> should only contain product 2
    const resB = await request(app)
      .get("/api/wishlist")
      .set("Authorization", `Bearer ${userTokenB}`);
    expect(resB.body.count).toBe(1);
    expect(resB.body.wishlist[0].id).toBe(testProduct2._id.toString());
  });

  it("POST /api/wishlist/invalid-id should return 400 Bad Request", async () => {
    const res = await request(app)
      .post("/api/wishlist/invalid-id-xyz")
      .set("Authorization", `Bearer ${userTokenA}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
