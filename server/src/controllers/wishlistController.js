import mongoose from "mongoose";
import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

// @desc    Get current authenticated user's wishlist
// @route   GET /api/wishlist
// @access  Private (Authenticated users only)
export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: "products",
      select: "name slug brand model modelNumber category thumbnail images lowestPrice isAvailable",
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    // Filter out nulls in case any referenced product was deleted
    const validProducts = (wishlist.products || []).filter(Boolean);

    res.status(200).json({
      success: true,
      count: validProducts.length,
      wishlist: validProducts.map((p) => ({
        ...p.toObject(),
        id: p._id.toString(),
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get only product IDs in current user's wishlist (for fast UI state checks)
// @route   GET /api/wishlist/ids
// @access  Private
export const getWishlistIds = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    const productIds = wishlist ? wishlist.products.map((p) => p.toString()) : [];

    res.status(200).json({
      success: true,
      count: productIds.length,
      productIds,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a product to authenticated user's wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product identifier format",
      });
    }

    // Verify product exists in catalog
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found in catalog",
      });
    }

    // Atomically add to user's wishlist using $addToSet (prevents duplicates)
    let wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $addToSet: { products: productId } },
      { upsert: true, returnDocument: "after" }
    ).populate({
      path: "products",
      select: "name slug brand model modelNumber category thumbnail images lowestPrice isAvailable",
    });

    const validProducts = (wishlist.products || []).filter(Boolean);

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      count: validProducts.length,
      wishlist: validProducts.map((p) => ({
        ...p.toObject(),
        id: p._id.toString(),
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a product from authenticated user's wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product identifier format",
      });
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { products: productId } },
      { returnDocument: "after" }
    ).populate({
      path: "products",
      select: "name slug brand model modelNumber category thumbnail images lowestPrice isAvailable",
    });

    const validProducts = wishlist ? (wishlist.products || []).filter(Boolean) : [];

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      count: validProducts.length,
      wishlist: validProducts.map((p) => ({
        ...p.toObject(),
        id: p._id.toString(),
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all products from authenticated user's wishlist
// @route   DELETE /api/wishlist
// @access  Private
export const clearWishlist = async (req, res, next) => {
  try {
    await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { $set: { products: [] } }
    );

    res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      count: 0,
      wishlist: [],
    });
  } catch (error) {
    next(error);
  }
};
