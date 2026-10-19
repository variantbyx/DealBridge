import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../models/User.js";

const demoUsers = [
  {
    name: "Alex Morgan",
    email: "alex@dealbridge.io",
    password: "Password123!",
    role: "buyer",
    company: "Apex Capital Partners",
    bio: "Focused on acquisitions in B2B SaaS, FinTech, and recurring revenue digital products with ARR between $1M-$10M.",
    isVerified: true,
  },
  {
    name: "Sarah Chen",
    email: "sarah@dealbridge.io",
    password: "Password123!",
    role: "seller",
    company: "CloudScale Labs",
    bio: "Serial founder seeking exit for a high-growth cloud infrastructure monitoring tool. $2.8M ARR, 68% gross margin.",
    isVerified: true,
  },
  {
    name: "David Vance",
    email: "david@dealbridge.io",
    password: "Password123!",
    role: "broker",
    company: "Sterling M&A Advisors",
    bio: "Licensed boutique investment banker specializing in lower middle-market tech exits and proprietary buyer syndication.",
    isVerified: true,
  },
  {
    name: "Admin Administrator",
    email: "admin@dealbridge.io",
    password: "Password123!",
    role: "admin",
    company: "DealBridge Operations",
    bio: "Platform administrator with full privileges to manage canonical products, merchant offers, and analytics.",
    isVerified: true,
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dealbridge";
    await mongoose.connect(mongoUri);
    console.log(`[Seed] Connected to MongoDB at: ${mongoUri}`);

    for (const userData of demoUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (!existing) {
        await User.create(userData);
        console.log(`[Seed] Created demo user: ${userData.email} (${userData.role})`);
      } else {
        console.log(`[Seed] User already exists: ${userData.email}`);
      }
    }

    console.log("[Seed] Seeding completed successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("[Seed] Error during seeding:", error);
    process.exit(1);
  }
};

seedDB();
