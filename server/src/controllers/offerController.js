import mongoose from "mongoose";
import MerchantOffer from "../models/MerchantOffer.js";
import Merchant from "../models/Merchant.js";
import Product from "../models/Product.js";
import { syncProductPrices } from "./productController.js";

// @desc    Add or update a merchant offer for a product
// @route   POST /api/products/:id/offers
// @access  Private/Admin
export const addOfferToProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product identifier format" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const {
      merchantId,
      price,
      originalPrice = 0,
      externalUrl,
      condition = "Brand New",
      shipping = "Standard Shipping",
      inStock = true,
      isActive = true,
    } = req.body;

    if (!merchantId || !mongoose.Types.ObjectId.isValid(merchantId)) {
      return res.status(400).json({ success: false, message: "Valid merchantId is required" });
    }

    if (price === undefined || isNaN(price) || Number(price) < 0) {
      return res.status(400).json({ success: false, message: "A valid positive price is required" });
    }

    if (!externalUrl || !/^https?:\/\/.+/i.test(externalUrl)) {
      return res.status(400).json({
        success: false,
        message: "A valid HTTP or HTTPS destination externalUrl is required",
      });
    }

    const merchant = await Merchant.findById(merchantId);
    if (!merchant) {
      return res.status(404).json({ success: false, message: "Merchant not found" });
    }

    // Upsert offer so that (product, merchant) pair remains unique
    const offer = await MerchantOffer.findOneAndUpdate(
      { product: id, merchant: merchantId },
      {
        product: id,
        merchant: merchantId,
        merchantName: merchant.name,
        price: Number(price),
        originalPrice: Number(originalPrice) || 0,
        externalUrl,
        condition,
        shipping,
        inStock: Boolean(inStock),
        isActive: Boolean(isActive),
        lastUpdated: new Date(),
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    ).populate("merchant", "name slug logo website rating trustScore");

    // Recalculate canonical product lowestPrice, highestPrice, offerCount
    await syncProductPrices(id);

    const updatedProduct = await Product.findById(id);

    res.status(201).json({
      success: true,
      message: "Merchant offer saved successfully",
      offer: {
        ...offer.toObject(),
        id: offer._id.toString(),
      },
      product: {
        id: updatedProduct._id.toString(),
        lowestPrice: updatedProduct.lowestPrice,
        highestPrice: updatedProduct.highestPrice,
        offerCount: updatedProduct.offerCount,
        isAvailable: updatedProduct.isAvailable,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing merchant offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
export const updateOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid offer identifier format" });
    }

    const offer = await MerchantOffer.findById(id);
    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }

    const {
      price,
      originalPrice,
      externalUrl,
      condition,
      shipping,
      inStock,
      isActive,
    } = req.body;

    if (price !== undefined) {
      if (isNaN(price) || Number(price) < 0) {
        return res.status(400).json({ success: false, message: "Price must be a positive number" });
      }
      offer.price = Number(price);
    }

    if (originalPrice !== undefined) {
      offer.originalPrice = Number(originalPrice) || 0;
    }

    if (externalUrl !== undefined) {
      if (!/^https?:\/\/.+/i.test(externalUrl)) {
        return res.status(400).json({
          success: false,
          message: "A valid HTTP or HTTPS destination externalUrl is required",
        });
      }
      offer.externalUrl = externalUrl;
    }

    if (condition !== undefined) offer.condition = condition;
    if (shipping !== undefined) offer.shipping = shipping;
    if (inStock !== undefined) offer.inStock = Boolean(inStock);
    if (isActive !== undefined) offer.isActive = Boolean(isActive);
    offer.lastUpdated = new Date();

    await offer.save();
    await syncProductPrices(offer.product);

    const populated = await MerchantOffer.findById(id).populate(
      "merchant",
      "name slug logo website rating trustScore"
    );

    res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      offer: {
        ...populated.toObject(),
        id: populated._id.toString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a merchant offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
export const deleteOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid offer identifier format" });
    }

    const offer = await MerchantOffer.findById(id);
    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }

    const productId = offer.product;
    await MerchantOffer.findByIdAndDelete(id);

    // Resync canonical product prices
    await syncProductPrices(productId);

    res.status(200).json({
      success: true,
      message: "Merchant offer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
