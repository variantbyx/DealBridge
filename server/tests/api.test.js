import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/models/User.js";

const TEST_MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dealbridge_test";

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URI);
  }
});

beforeEach(async () => {
  // Clear users before each test
  await User.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.disconnect();
});

describe("Phase 0: Infrastructure & Health Check", () => {
  it("GET /api/health should return 200 with status ok and database connected", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.service).toBe("DealBridge API");
    expect(res.body.database.status).toBe("connected");
  });

  it("GET /api/nonexistent should return 404 JSON error", async () => {
    const res = await request(app).get("/api/nonexistent");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe("Phase 1: Authentication & User Management", () => {
  const mockUser = {
    name: "Alex Morgan",
    email: "alex@dealbridge.io",
    password: "Password123!",
    role: "buyer",
    company: "Apex Capital",
    bio: "Looking for SaaS and e-commerce acquisitions",
  };

  it("POST /api/auth/register should create a new user and set auth cookie", async () => {
    const res = await request(app).post("/api/auth/register").send(mockUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user.email).toBe(mockUser.email);
    expect(res.body.user.role).toBe("buyer");
    expect(res.body.user.password).toBeUndefined(); // Password must not be returned
    expect(res.body.token).toBeDefined();

    // Verify auth cookie
    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies.some((c) => c.startsWith("token="))).toBe(true);
  });

  it("POST /api/auth/register should fail on duplicate email", async () => {
    await request(app).post("/api/auth/register").send(mockUser);
    const res = await request(app).post("/api/auth/register").send(mockUser);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("already exists");
  });

  it("POST /api/auth/register should fail on invalid email or short password", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "T",
      email: "invalid-email",
      password: "123",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it("POST /api/auth/login should authenticate user and issue token", async () => {
    // Register user first
    await request(app).post("/api/auth/register").send(mockUser);

    // Login
    const res = await request(app).post("/api/auth/login").send({
      email: mockUser.email,
      password: mockUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(mockUser.email);

    // Wrong password should fail
    const wrongRes = await request(app).post("/api/auth/login").send({
      email: mockUser.email,
      password: "WrongPassword!",
    });

    expect(wrongRes.status).toBe(401);
    expect(wrongRes.body.success).toBe(false);
  });

  it("GET /api/auth/me should return current user for authenticated session", async () => {
    const regRes = await request(app).post("/api/auth/register").send(mockUser);
    const cookies = regRes.headers["set-cookie"];

    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Cookie", cookies);

    expect(meRes.status).toBe(200);
    expect(meRes.body.success).toBe(true);
    expect(meRes.body.user.email).toBe(mockUser.email);
    expect(meRes.body.user.name).toBe(mockUser.name);
  });

  it("PUT /api/auth/profile should update profile details", async () => {
    const regRes = await request(app).post("/api/auth/register").send(mockUser);
    const cookies = regRes.headers["set-cookie"];

    const updateRes = await request(app)
      .put("/api/auth/profile")
      .set("Cookie", cookies)
      .send({
        name: "Alexander Morgan, MBA",
        company: "Apex Private Equity",
        bio: "Updated bio for investor profile",
      });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.success).toBe(true);
    expect(updateRes.body.user.name).toBe("Alexander Morgan, MBA");
    expect(updateRes.body.user.company).toBe("Apex Private Equity");
  });

  it("POST /api/auth/logout should clear the auth cookie", async () => {
    const res = await request(app).post("/api/auth/logout");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const cookies = res.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies.some((c) => c.includes("token=;"))).toBe(true);
  });

  it("GET /api/auth/me should succeed using Bearer authorization header", async () => {
    const regRes = await request(app).post("/api/auth/register").send(mockUser);
    const token = regRes.body.token;

    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.success).toBe(true);
    expect(meRes.body.user.email).toBe(mockUser.email);
  });

  it("GET /api/auth/me should reject requests without token with 401", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/auth/me should reject invalid token with 401", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalid-token-string");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
