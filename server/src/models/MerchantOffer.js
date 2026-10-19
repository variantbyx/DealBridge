import mongoose from "mongoose";

const merchantOfferSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
      index: true,
    },
    merchant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      required: [true, "Merchant reference is required"],
      index: true,
    },
    merchantName: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    externalUrl: {
      type: String,
      required: [true, "External product URL is required"],
      trim: true,
      match: [/^https?:\/\/.+/, "External URL must be a valid HTTP or HTTPS destination"],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    shipping: {
      type: String,
      default: "Standard Delivery",
      trim: true,
    },
    condition: {
      type: String,
      enum: ["Brand New", "Refurbished", "Open Box"],
      default: "Brand New",
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a merchant only has one active offer per product
merchantOfferSchema.index({ product: 1, merchant: 1 }, { unique: true });

// Sanitize JSON
merchantOfferSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj.__v;
  return obj;
};

const MerchantOffer = mongoose.model("MerchantOffer", merchantOfferSchema);

export default MerchantOffer;
