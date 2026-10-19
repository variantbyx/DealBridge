import mongoose from "mongoose";
import Product from "../models/Product.js";
import MerchantOffer from "../models/MerchantOffer.js";
import Merchant from "../models/Merchant.js";
import ClickEvent from "../models/ClickEvent.js";
import User from "../models/User.js";

// @desc    Get comprehensive system analytics and catalog metrics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    // 1. Core counters
    const [
      totalProducts,
      activeProducts,
      totalOffers,
      activeOffers,
      totalClicks,
      totalUsers,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isAvailable: true }),
      MerchantOffer.countDocuments(),
      MerchantOffer.countDocuments({ inStock: true, isActive: true }),
      ClickEvent.countDocuments(),
      User.countDocuments(),
    ]);

    // 2. Most-clicked products
    const mostClickedProducts = await ClickEvent.aggregate([
      { $group: { _id: "$product", clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          clicks: 1,
          id: "$product._id",
          name: "$product.name",
          brand: "$product.brand",
          modelNumber: "$product.modelNumber",
          category: "$product.category",
          thumbnail: "$product.thumbnail",
          lowestPrice: "$product.lowestPrice",
        },
      },
    ]);

    // 3. Most-clicked merchants
    const mostClickedMerchants = await ClickEvent.aggregate([
      { $group: { _id: "$merchant", clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "merchants",
          localField: "_id",
          foreignField: "_id",
          as: "merchant",
        },
      },
      { $unwind: "$merchant" },
      {
        $project: {
          _id: 0,
          clicks: 1,
          id: "$merchant._id",
          name: "$merchant.name",
          slug: "$merchant.slug",
          logo: "$merchant.logo",
          website: "$merchant.website",
        },
      },
    ]);

    // 4. Category breakdown
    const categoryDistribution = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgLowestPrice: { $avg: "$lowestPrice" },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
          avgPrice: { $round: ["$avgLowestPrice", 0] },
        },
      },
    ]);

    // 5. 7-day click timeline
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dailyTrend = await ClickEvent.aggregate([
      { $match: { timestamp: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          clicks: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", clicks: 1 } },
    ]);

    // 6. Device breakdown
    const deviceBreakdown = await ClickEvent.aggregate([
      {
        $project: {
          device: {
            $cond: [
              { $regexMatch: { input: "$userAgent", regex: /mobile|android|iphone/i } },
              "Mobile",
              "Desktop",
            ],
          },
        },
      },
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $project: { _id: 0, device: "$_id", count: 1 } },
    ]);

    // 7. Recent click activities
    const recentClicks = await ClickEvent.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .populate("product", "name brand modelNumber thumbnail slug")
      .populate("merchant", "name logo website")
      .populate("user", "name email role")
      .lean();

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        totalOffers,
        activeOffers,
        totalClicks,
        totalUsers,
        mostClickedProducts,
        mostClickedMerchants,
        categoryDistribution,
        dailyTrend,
        deviceBreakdown,
        recentClicks: recentClicks.map((c) => ({
          ...c,
          id: c._id.toString(),
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active merchants (for offer assignment dropdowns)
// @route   GET /api/admin/merchants
// @access  Private/Admin
export const getAllMerchants = async (req, res, next) => {
  try {
    const merchants = await Merchant.find({ isActive: true })
      .sort({ name: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: merchants.length,
      merchants: merchants.map((m) => ({
        ...m,
        id: m._id.toString(),
      })),
    });
  } catch (error) {
    next(error);
  }
};
