import mongoose from "mongoose";
import Product from "../models/Product.js";
import MerchantOffer from "../models/MerchantOffer.js";
import Merchant from "../models/Merchant.js";

// Helper: Synchronize lowestPrice, highestPrice, offerCount on a product
export const syncProductPrices = async (productId) => {
  const offers = await MerchantOffer.find({ product: productId, isActive: true, inStock: true });
  if (offers.length === 0) {
    await Product.findByIdAndUpdate(productId, {
      lowestPrice: 0,
      highestPrice: 0,
      offerCount: 0,
      isAvailable: false,
    });
    return;
  }

  const prices = offers.map((o) => o.price);
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);

  await Product.findByIdAndUpdate(productId, {
    lowestPrice,
    highestPrice,
    offerCount: offers.length,
    isAvailable: true,
  });
};

// @desc    Get all products with server-side search, filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Category filter
    if (category && category !== "all") {
      query.category = category.toLowerCase().trim();
    }

    // Brand filter (supports comma-separated list e.g. "Apple,Samsung")
    if (brand && brand !== "all") {
      const brands = brand
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean);
      if (brands.length === 1) {
        query.brand = new RegExp(`^${brands[0]}$`, "i");
      } else if (brands.length > 1) {
        query.brand = { $in: brands.map((b) => new RegExp(`^${b}$`, "i")) };
      }
    }

    // Full-text search or regex search
    if (search && search.trim()) {
      const searchTerm = search.trim();
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } },
        { brand: { $regex: searchTerm, $options: "i" } },
        { model: { $regex: searchTerm, $options: "i" } },
        { modelNumber: { $regex: searchTerm, $options: "i" } },
        { description: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // Price range filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.lowestPrice = {};
      if (minPrice !== undefined && !isNaN(minPrice)) {
        query.lowestPrice.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && !isNaN(maxPrice)) {
        query.lowestPrice.$lte = Number(maxPrice);
      }
    }

    // Stock availability
    if (inStock === "true" || inStock === true) {
      query.isAvailable = true;
    }

    // Sorting
    let sortOptions = { popularity: -1, createdAt: -1 };
    if (sort === "price_asc") {
      sortOptions = { lowestPrice: 1 };
    } else if (sort === "price_desc") {
      sortOptions = { lowestPrice: -1 };
    } else if (sort === "newest") {
      sortOptions = { createdAt: -1 };
    } else if (sort === "popular") {
      sortOptions = { popularity: -1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(query),
    ]);

    // Aggregate available brands and categories for dynamic facets
    const facetFilter = category && category !== "all" ? { category: category.toLowerCase().trim() } : {};
    const availableBrands = await Product.distinct("brand", facetFilter);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      products: products.map((p) => ({
        ...p,
        id: p._id.toString(),
      })),
      facets: {
        brands: availableBrands.sort(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or slug with populated merchant offers
// @route   GET /api/products/:idOrSlug
// @access  Public
export const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    let product = null;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      product = await Product.findById(idOrSlug).lean();
    }
    if (!product) {
      product = await Product.findOne({ slug: idOrSlug.toLowerCase() }).lean();
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Fetch all active merchant offers associated with this canonical product
    const offers = await MerchantOffer.find({ product: product._id, isActive: true })
      .populate("merchant", "name slug logo website rating trustScore")
      .sort({ price: 1 })
      .lean();

    // Identify lowest price
    const lowestPrice = offers.length > 0 ? offers[0].price : 0;

    const enrichedOffers = offers.map((offer, idx) => ({
      ...offer,
      id: offer._id.toString(),
      isLowestPrice: idx === 0,
      savings:
        offer.originalPrice && offer.originalPrice > offer.price
          ? Math.round(((offer.originalPrice - offer.price) / offer.originalPrice) * 100)
          : 0,
    }));

    // Asynchronously increment popularity
    Product.findByIdAndUpdate(product._id, { $inc: { popularity: 1 } }).exec();

    res.status(200).json({
      success: true,
      product: {
        ...product,
        id: product._id.toString(),
        lowestPrice,
        offers: enrichedOffers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get merchant offers for a specific product
// @route   GET /api/products/:id/offers
// @access  Public
export const getProductOffers = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product ID format" });
    }

    const offers = await MerchantOffer.find({ product: id, isActive: true })
      .populate("merchant", "name slug logo website rating trustScore")
      .sort({ price: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: offers.length,
      offers: offers.map((o) => ({
        ...o,
        id: o._id.toString(),
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category summary counts
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const counts = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 }, sampleImage: { $first: "$thumbnail" } } },
      { $sort: { _id: 1 } },
    ]);

    const categories = [
      { id: "watches", name: "Watches", icon: "Watch" },
      { id: "smartphones", name: "Smartphones", icon: "Smartphone" },
      { id: "laptops", name: "Laptops", icon: "Laptop" },
      { id: "headphones", name: "Headphones", icon: "Headphones" },
      { id: "fashion", name: "Fashion", icon: "Shirt" },
      { id: "home-appliances", name: "Home Appliances", icon: "Home" },
    ].map((cat) => {
      const found = counts.find((c) => c._id === cat.id);
      return {
        ...cat,
        count: found ? found.count : 0,
        sampleImage: found ? found.sampleImage : "",
      };
    });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new canonical product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      brand,
      model,
      modelNumber,
      category,
      description,
      specifications,
      thumbnail,
      images,
      tags,
      isAvailable = true,
    } = req.body;

    if (!name || !brand || !model || !modelNumber || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required product fields: name, brand, model, modelNumber, category, description",
      });
    }

    const canonicalKey = Product.generateCanonicalKey(brand, model, modelNumber);
    const existing = await Product.findOne({ canonicalKey });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A canonical product with brand '${brand}' and model number '${modelNumber}' already exists`,
      });
    }

    // Generate unique slug
    let baseSlug = (name || `${brand} ${model}`)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    let slug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const productImages = Array.isArray(images) && images.length > 0 ? images : thumbnail ? [thumbnail] : [];
    const productThumb = thumbnail || (productImages.length > 0 ? productImages[0] : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600");

    const product = await Product.create({
      name,
      slug,
      brand,
      model,
      modelNumber,
      canonicalKey,
      category: category.toLowerCase().trim(),
      description,
      specifications: Array.isArray(specifications) ? specifications : [],
      thumbnail: productThumb,
      images: productImages,
      tags: Array.isArray(tags) ? tags : [],
      isAvailable: Boolean(isAvailable),
      lowestPrice: 0,
      highestPrice: 0,
      offerCount: 0,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: {
        ...product.toObject(),
        id: product._id.toString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing canonical product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
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
      name,
      brand,
      model,
      modelNumber,
      category,
      description,
      specifications,
      thumbnail,
      images,
      tags,
      isAvailable,
    } = req.body;

    // Check if canonical key changes and if it conflicts with another product
    const newBrand = brand || product.brand;
    const newModel = model || product.model;
    const newModelNumber = modelNumber || product.modelNumber;
    const newCanonicalKey = Product.generateCanonicalKey(newBrand, newModel, newModelNumber);

    if (newCanonicalKey !== product.canonicalKey) {
      const conflict = await Product.findOne({ canonicalKey: newCanonicalKey, _id: { $ne: id } });
      if (conflict) {
        return res.status(409).json({
          success: false,
          message: `Another canonical product already exists with model number '${newModelNumber}' for '${newBrand}'`,
        });
      }
      product.canonicalKey = newCanonicalKey;
    }

    if (name) product.name = name;
    if (brand) product.brand = brand;
    if (model) product.model = model;
    if (modelNumber) product.modelNumber = modelNumber;
    if (category) product.category = category.toLowerCase().trim();
    if (description) product.description = description;
    if (specifications !== undefined) product.specifications = Array.isArray(specifications) ? specifications : [];
    if (thumbnail !== undefined) product.thumbnail = thumbnail;
    if (images !== undefined) product.images = Array.isArray(images) ? images : [];
    if (tags !== undefined) product.tags = Array.isArray(tags) ? tags : [];
    if (isAvailable !== undefined) product.isAvailable = Boolean(isAvailable);

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: {
        ...product.toObject(),
        id: product._id.toString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete or deactivate a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product identifier format" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Delete associated offers
    await MerchantOffer.deleteMany({ product: id });
    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product and associated merchant offers deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle product availability status
// @route   PATCH /api/products/:id/availability
// @access  Private/Admin
export const toggleProductAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid product identifier format" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.isAvailable = !product.isAvailable;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product is now ${product.isAvailable ? "available" : "deactivated"}`,
      isAvailable: product.isAvailable,
      product: {
        ...product.toObject(),
        id: product._id.toString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

