import mongoose from "mongoose";
import MerchantOffer from "../models/MerchantOffer.js";
import ClickEvent from "../models/ClickEvent.js";
import Product from "../models/Product.js";

// @desc    Redirect to external merchant offer and track click event
// @route   GET /api/redirect/:offerId
// @access  Public
export const handleRedirect = async (req, res, next) => {
  try {
    const { offerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(offerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid offer identifier",
      });
    }

    const offer = await MerchantOffer.findById(offerId).lean();
    if (!offer || !offer.isActive) {
      return res.status(404).json({
        success: false,
        message: "Offer not found or no longer active",
      });
    }

    // Security check: Destination must be a valid http/https URL and cannot be arbitrary user input
    const destinationUrl = offer.externalUrl;
    if (!destinationUrl || !/^https?:\/\/.+/i.test(destinationUrl)) {
      return res.status(400).json({
        success: false,
        message: "Untrusted or invalid destination URL configured for this offer",
      });
    }

    // Asynchronously record the ClickEvent so redirect is immediate and non-blocking
    const clickData = {
      product: offer.product,
      offer: offer._id,
      merchant: offer.merchant,
      user: req.user ? req.user._id : null,
      ip: req.ip || req.headers["x-forwarded-for"] || "",
      userAgent: req.headers["user-agent"] || "",
      referrer: req.headers["referer"] || req.headers["referrer"] || "",
      timestamp: new Date(),
    };

    ClickEvent.create(clickData).catch((err) => {
      console.error("[ClickTracking] Failed to save click event:", err.message);
    });

    // Also increment product popularity count
    Product.findByIdAndUpdate(offer.product, { $inc: { popularity: 1 } }).exec();

    // If client requested JSON (e.g., fetch API or testing), return the payload
    if (req.headers.accept && req.headers.accept.includes("application/json") && req.query.format === "json") {
      return res.status(200).json({
        success: true,
        redirectUrl: destinationUrl,
        merchantName: offer.merchantName,
        price: offer.price,
      });
    }

    // Set cache control so browser doesn't cache the redirect permanently
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.redirect(302, destinationUrl);
  } catch (error) {
    next(error);
  }
};

// @desc    Record click event via POST (for client beacons)
// @route   POST /api/tracking/click
// @access  Public
export const recordClickBeacon = async (req, res, next) => {
  try {
    const { offerId, productId, merchantId } = req.body;

    if (!offerId || !mongoose.Types.ObjectId.isValid(offerId)) {
      return res.status(400).json({ success: false, message: "Valid offerId is required" });
    }

    const clickData = {
      product: productId,
      offer: offerId,
      merchant: merchantId,
      user: req.user ? req.user._id : null,
      ip: req.ip || req.headers["x-forwarded-for"] || "",
      userAgent: req.headers["user-agent"] || "",
      referrer: req.headers["referer"] || "",
      timestamp: new Date(),
    };

    await ClickEvent.create(clickData);

    res.status(200).json({
      success: true,
      message: "Click recorded successfully",
    });
  } catch (error) {
    next(error);
  }
};
