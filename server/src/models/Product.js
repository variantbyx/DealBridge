import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      index: true,
    },
    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
    },
    modelNumber: {
      type: String,
      required: [true, "Model number is required"],
      trim: true,
      index: true,
    },
    canonicalKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "watches",
          "smartphones",
          "laptops",
          "headphones",
          "fashion",
          "home-appliances",
        ],
        message: "{VALUE} is not a supported category",
      },
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    images: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      default: "",
    },
    specifications: [
      {
        key: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    lowestPrice: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    highestPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    offerCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    popularity: {
      type: Number,
      default: 0,
      index: true,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Compound text index for robust full-text search across name, brand, model, description
productSchema.index({
  name: "text",
  brand: "text",
  model: "text",
  modelNumber: "text",
  description: "text",
});

// Helper to sanitize JSON
productSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id.toString();
  delete obj.__v;
  return obj;
};

// Static helper to generate a canonical key from brand, model, and modelNumber
productSchema.statics.generateCanonicalKey = function (brand, model, modelNumber) {
  const clean = (str) =>
    (str || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  return `${clean(brand)}:${clean(model)}:${clean(modelNumber)}`;
};

const Product = mongoose.model("Product", productSchema);

export default Product;
