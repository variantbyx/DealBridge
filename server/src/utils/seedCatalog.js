import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Merchant from "../models/Merchant.js";
import Product from "../models/Product.js";
import MerchantOffer from "../models/MerchantOffer.js";

const merchantsData = [
  {
    name: "Amazon",
    slug: "amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    website: "https://www.amazon.com",
    rating: 4.8,
    trustScore: 98,
  },
  {
    name: "Best Buy",
    slug: "best-buy",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_Logo.svg",
    website: "https://www.bestbuy.com",
    rating: 4.7,
    trustScore: 96,
  },
  {
    name: "Flipkart",
    slug: "flipkart",
    logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg",
    website: "https://www.flipkart.com",
    rating: 4.6,
    trustScore: 94,
  },
  {
    name: "B&H Photo Video",
    slug: "bh-photo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/B%26H_Photo_Video_Logo.svg",
    website: "https://www.bhphotovideo.com",
    rating: 4.9,
    trustScore: 99,
  },
  {
    name: "Target",
    slug: "target",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Target_logo.svg",
    website: "https://www.target.com",
    rating: 4.6,
    trustScore: 93,
  },
  {
    name: "Chrono24",
    slug: "chrono24",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/87/Chrono24_Logo.svg",
    website: "https://www.chrono24.com",
    rating: 4.9,
    trustScore: 97,
  },
];

const productsData = [
  // 1. SMARTPHONES
  {
    name: "Apple iPhone 16 Pro Max 256GB",
    slug: "apple-iphone-16-pro-max-256gb",
    brand: "Apple",
    model: "iPhone 16 Pro Max",
    modelNumber: "A3084",
    category: "smartphones",
    description:
      "Apple iPhone 16 Pro Max features a forged Titanium design, 6.9-inch Super Retina XDR display with ProMotion, Camera Control button, and the blazing A18 Pro chip.",
    thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80",
    ],
    specifications: [
      { key: "Display", value: "6.9-inch OLED Super Retina XDR 120Hz" },
      { key: "Processor", value: "Apple A18 Pro 3nm" },
      { key: "Camera", value: "48MP Main + 48MP Ultra-Wide + 12MP 5x Telephoto" },
      { key: "Storage", value: "256 GB NVMe" },
      { key: "Battery", value: "Up to 33 hours video playback" },
    ],
    tags: ["flagship", "5g", "titanium", "apple"],
    offers: [
      {
        merchantSlug: "amazon",
        price: 1199,
        originalPrice: 1299,
        url: "https://www.amazon.com/dp/B0BDHWDR12?tag=dealbridge-20",
        shipping: "Free Prime 1-Day",
        condition: "Brand New",
      },
      {
        merchantSlug: "best-buy",
        price: 1219,
        originalPrice: 1299,
        url: "https://www.bestbuy.com/site/apple-iphone-16-pro-max-256gb/6525412.p",
        shipping: "Free Store Pickup Today",
        condition: "Brand New",
      },
      {
        merchantSlug: "bh-photo",
        price: 1249,
        originalPrice: 1299,
        url: "https://www.bhphotovideo.com/c/product/1792410-REG/apple_iphone_16_pro_max.html",
        shipping: "Free Expedited Shipping",
        condition: "Brand New",
      },
    ],
  },
  {
    name: "Samsung Galaxy S25 Ultra 512GB",
    slug: "samsung-galaxy-s25-ultra-512gb",
    brand: "Samsung",
    model: "Galaxy S25 Ultra",
    modelNumber: "SM-S938B",
    category: "smartphones",
    description:
      "Samsung Galaxy S25 Ultra brings Galaxy AI 2.0, Snapdragon 8 Elite processor, integrated S-Pen, and a 200MP quad camera setup with titanium frame.",
    thumbnail: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80",
    ],
    specifications: [
      { key: "Display", value: "6.8-inch Dynamic AMOLED 2X, 120Hz, 3000 nits" },
      { key: "Processor", value: "Snapdragon 8 Elite for Galaxy" },
      { key: "Camera", value: "200MP + 50MP + 50MP + 12MP" },
      { key: "Battery", value: "5000 mAh with 45W Fast Charging" },
      { key: "Stylus", value: "Built-in S Pen" },
    ],
    tags: ["android", "s-pen", "galaxy-ai", "200mp"],
    offers: [
      {
        merchantSlug: "best-buy",
        price: 1299,
        originalPrice: 1419,
        url: "https://www.bestbuy.com/site/samsung-galaxy-s25-ultra-512gb/6584210.p",
        shipping: "Free Shipping",
        condition: "Brand New",
      },
      {
        merchantSlug: "amazon",
        price: 1320,
        originalPrice: 1419,
        url: "https://www.amazon.com/dp/B0D1924823?tag=dealbridge-20",
        shipping: "Free 2-Day Shipping",
        condition: "Brand New",
      },
    ],
  },

  // 2. LAPTOPS
  {
    name: "Apple MacBook Pro 16-inch M3 Max (36GB / 1TB)",
    slug: "apple-macbook-pro-16-m3-max",
    brand: "Apple",
    model: "MacBook Pro 16",
    modelNumber: "MUW63LL/A",
    category: "laptops",
    description:
      "Engineered for pro developers and creators. Apple M3 Max with 14-core CPU and 30-core GPU, Liquid Retina XDR display, up to 22 hours of battery life.",
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    ],
    specifications: [
      { key: "Processor", value: "Apple M3 Max (14-Core CPU)" },
      { key: "Graphics", value: "30-Core Integrated GPU" },
      { key: "Memory", value: "36 GB Unified Memory" },
      { key: "Storage", value: "1 TB Superfast SSD" },
      { key: "Display", value: '16.2" Liquid Retina XDR (3456 x 2234)' },
    ],
    tags: ["macbook", "m3-max", "retina", "workstation"],
    offers: [
      {
        merchantSlug: "bh-photo",
        price: 3299,
        originalPrice: 3499,
        url: "https://www.bhphotovideo.com/c/product/1793620-REG/apple_macbook_pro_16_m3_max.html",
        shipping: "Free Next-Day Air",
        condition: "Brand New",
      },
      {
        merchantSlug: "amazon",
        price: 3349,
        originalPrice: 3499,
        url: "https://www.amazon.com/dp/B0CM59C3Z1?tag=dealbridge-20",
        shipping: "Free Prime Delivery",
        condition: "Brand New",
      },
      {
        merchantSlug: "best-buy",
        price: 3399,
        originalPrice: 3499,
        url: "https://www.bestbuy.com/site/apple-macbook-pro-16-laptop-m3-max/6534612.p",
        shipping: "Free 2-Day Delivery",
        condition: "Brand New",
      },
    ],
  },
  {
    name: "Dell XPS 15 9530 OLED (i9 / RTX 4070 / 32GB)",
    slug: "dell-xps-15-9530-oled",
    brand: "Dell",
    model: "XPS 15",
    modelNumber: "XPS9530-7492SLV",
    category: "laptops",
    description:
      "Stunning 3.5K OLED InfinityEdge touch display combined with 13th Gen Intel Core i9 processor and NVIDIA GeForce RTX 4070 in a machined aluminum chassis.",
    thumbnail: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80",
    ],
    specifications: [
      { key: "Processor", value: "Intel Core i9-13900H (14 cores, up to 5.4 GHz)" },
      { key: "GPU", value: "NVIDIA GeForce RTX 4070 8GB GDDR6" },
      { key: "Display", value: '15.6" 3.5K (3456x2160) OLED Touch 400-nit' },
      { key: "RAM", value: "32 GB DDR5 4800MHz" },
      { key: "Storage", value: "1 TB M.2 PCIe NVMe SSD" },
    ],
    tags: ["windows", "oled", "intel-i9", "rtx4070"],
    offers: [
      {
        merchantSlug: "amazon",
        price: 1899,
        originalPrice: 2299,
        url: "https://www.amazon.com/dp/B0C3928120?tag=dealbridge-20",
        shipping: "Free 2-Day Shipping",
        condition: "Brand New",
      },
      {
        merchantSlug: "best-buy",
        price: 1949,
        originalPrice: 2299,
        url: "https://www.bestbuy.com/site/dell-xps-15-oled-laptop/6541289.p",
        shipping: "Free Shipping",
        condition: "Brand New",
      },
    ],
  },

  // 3. WATCHES
  {
    name: "Rolex Submariner Date 41mm Oystersteel",
    slug: "rolex-submariner-date-41mm-126610ln",
    brand: "Rolex",
    model: "Submariner Date",
    modelNumber: "126610LN",
    category: "watches",
    description:
      "The benchmark among divers' watches. Black Cerachrom ceramic bezel, black dial with luminescent Chromalight markers, robust Oyster bracelet, and Calibre 3235 automatic movement.",
    thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
    ],
    specifications: [
      { key: "Case Diameter", value: "41 mm Oystersteel" },
      { key: "Movement", value: "Rolex Calibre 3235 Automatic (70h reserve)" },
      { key: "Water Resistance", value: "300 meters / 1,000 feet" },
      { key: "Bezel", value: "Unidirectional rotatable 60-min Cerachrom" },
      { key: "Crystal", value: "Scratch-resistant Sapphire with Cyclops lens" },
    ],
    tags: ["luxury", "swiss", "diver", "rolex"],
    offers: [
      {
        merchantSlug: "chrono24",
        price: 13950,
        originalPrice: 15200,
        url: "https://www.chrono24.com/rolex/submariner-date-126610ln--id289124.htm",
        shipping: "Insured Courier Shipping",
        condition: "Brand New",
      },
      {
        merchantSlug: "bh-photo",
        price: 14400,
        originalPrice: 15200,
        url: "https://www.bhphotovideo.com/c/product/1812001-REG/rolex_submariner_126610ln.html",
        shipping: "Armored Transport",
        condition: "Brand New",
      },
    ],
  },
  {
    name: "Apple Watch Ultra 2 Titanium (49mm Cellular)",
    slug: "apple-watch-ultra-2-titanium-49mm",
    brand: "Apple",
    model: "Watch Ultra 2",
    modelNumber: "MRF83LL/A",
    category: "watches",
    description:
      "The most rugged and capable Apple Watch. 49mm aerospace-grade titanium case, precision dual-frequency GPS, up to 72 hours of battery in Low Power Mode, and 3000-nit display.",
    thumbnail: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&auto=format&fit=crop&q=80",
    ],
    specifications: [
      { key: "Case", value: "49mm Natural Titanium" },
      { key: "Display", value: "Always-On Retina OLED, 3000 nits" },
      { key: "Water Resistance", value: "100m, WR100, EN13319 Dive Computer certified" },
      { key: "Battery Life", value: "36 hours normal, up to 72 hours low power" },
    ],
    tags: ["smartwatch", "apple", "fitness", "gps"],
    offers: [
      {
        merchantSlug: "amazon",
        price: 749,
        originalPrice: 799,
        url: "https://www.amazon.com/dp/B0CHX5VHQY?tag=dealbridge-20",
        shipping: "Free Prime 1-Day",
        condition: "Brand New",
      },
      {
        merchantSlug: "best-buy",
        price: 769,
        originalPrice: 799,
        url: "https://www.bestbuy.com/site/apple-watch-ultra-2-49mm/6537241.p",
        shipping: "Free Store Pickup",
        condition: "Brand New",
      },
      {
        merchantSlug: "target",
        price: 789,
        originalPrice: 799,
        url: "https://www.target.com/p/apple-watch-ultra-2-titanium/-/A-89241829",
        shipping: "Free Standard Shipping",
        condition: "Brand New",
      },
    ],
  },

  // 4. HEADPHONES
  {
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    slug: "sony-wh-1000xm5-noise-cancelling",
    brand: "Sony",
    model: "WH-1000XM5",
    modelNumber: "WH1000XM5/B",
    category: "headphones",
    description:
      "Industry-leading active noise cancellation with 8 microphones and Auto NC Optimizer. High-resolution audio with LDAC, crystal clear hands-free calling, and 30-hour battery.",
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    ],
    specifications: [
      { key: "Noise Cancelling", value: "Industry-leading Dual Processor V1 & QN1" },
      { key: "Battery Life", value: "30 hours (ANC On), 40 hours (ANC Off)" },
      { key: "Fast Charge", value: "3 min charge gives 3 hours playback" },
      { key: "Bluetooth Codecs", value: "LDAC, AAC, SBC" },
      { key: "Weight", value: "250g ultra-comfortable soft fit leather" },
    ],
    tags: ["anc", "bluetooth", "audiophile", "sony"],
    offers: [
      {
        merchantSlug: "amazon",
        price: 348,
        originalPrice: 399,
        url: "https://www.amazon.com/dp/B09XS7JWHH?tag=dealbridge-20",
        shipping: "Free Prime 1-Day",
        condition: "Brand New",
      },
      {
        merchantSlug: "best-buy",
        price: 379,
        originalPrice: 399,
        url: "https://www.bestbuy.com/site/sony-wh-1000xm5-wireless-noise-canceling-headphones/6505727.p",
        shipping: "Free Shipping",
        condition: "Brand New",
      },
      {
        merchantSlug: "target",
        price: 398,
        originalPrice: 399,
        url: "https://www.target.com/p/sony-wh-1000xm5/-/A-86254129",
        shipping: "Free Delivery",
        condition: "Brand New",
      },
    ],
  },
  {
    name: "Apple AirPods Max with Smart Case",
    slug: "apple-airpods-max-space-gray",
    brand: "Apple",
    model: "AirPods Max",
    modelNumber: "MGYH3AM/A",
    category: "headphones",
    description:
      "Apple-designed dynamic driver provides high-fidelity audio. Active Noise Cancellation with Transparency mode, Spatial Audio with dynamic head tracking, and knit-mesh canopy.",
    thumbnail: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80",
    ],
    specifications: [
      { key: "Audio Technology", value: "Apple H1 headphone chip (each ear cup)" },
      { key: "Spatial Audio", value: "Personalized Spatial Audio with dynamic head tracking" },
      { key: "Battery", value: "20 hours listening time on single charge" },
      { key: "Ear Cushions", value: "Acoustically engineered memory foam" },
    ],
    tags: ["apple", "anc", "spatial-audio", "over-ear"],
    offers: [
      {
        merchantSlug: "amazon",
        price: 479,
        originalPrice: 549,
        url: "https://www.amazon.com/dp/B08PZHYWJS?tag=dealbridge-20",
        shipping: "Free Prime Delivery",
        condition: "Brand New",
      },
      {
        merchantSlug: "bh-photo",
        price: 499,
        originalPrice: 549,
        url: "https://www.bhphotovideo.com/c/product/1612410-REG/apple_airpods_max_space_gray.html",
        shipping: "Free Expedited Shipping",
        condition: "Brand New",
      },
    ],
  },

  // 5. FASHION
  {
    name: "Nike Air Jordan 1 Retro High OG 'Chicago Lost & Found'",
    slug: "nike-air-jordan-1-retro-high-og-chicago",
    brand: "Nike",
    model: "Air Jordan 1 Retro High",
    modelNumber: "DZ5485-612",
    category: "fashion",
    description:
      "The holy grail of sneaker culture. Classic Varsity Red, Black, and Sail colorway crafted from premium cracked leather with retro 1985 box packaging.",
    thumbnail: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
    ],
    specifications: [
      { key: "Colorway", value: "Varsity Red / Black / Sail / Muslin" },
      { key: "Upper Material", value: "Premium Full-Grain and Cracked Leather" },
      { key: "Sole", value: "Rubber cupsole with encapsulated Air-Sole unit" },
      { key: "Style Code", value: "DZ5485-612" },
    ],
    tags: ["sneakers", "jordan", "streetwear", "hype"],
    offers: [
      {
        merchantSlug: "flipkart",
        price: 185,
        originalPrice: 220,
        url: "https://www.flipkart.com/nike-air-jordan-1-retro/p/itm1289410",
        shipping: "Free Express Shipping",
        condition: "Brand New",
      },
      {
        merchantSlug: "amazon",
        price: 210,
        originalPrice: 220,
        url: "https://www.amazon.com/dp/B0BM924110?tag=dealbridge-20",
        shipping: "Standard Delivery",
        condition: "Brand New",
      },
    ],
  },

  // 6. HOME APPLIANCES
  {
    name: "Dyson V15 Detect Absolute Cordless Vacuum",
    slug: "dyson-v15-detect-absolute-cordless-vacuum",
    brand: "Dyson",
    model: "V15 Detect Absolute",
    modelNumber: "368340-01",
    category: "home-appliances",
    description:
      "Dyson's most intelligent, powerful cordless vacuum. Features a laser that reveals microscopic dust, acoustic piezo sensor that counts particles, and auto-adapting suction.",
    thumbnail: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80",
    ],
    specifications: [
      { key: "Suction Power", value: "240 Air Watts with Dyson Hyperdymium motor" },
      { key: "Run Time", value: "Up to 60 minutes fade-free power" },
      { key: "Filtration", value: "Whole-machine filtration captures 99.99% of particles" },
      { key: "Bin Volume", value: "0.2 Gallons (0.76 L) with point-and-shoot emptying" },
    ],
    tags: ["vacuum", "cordless", "dyson", "smart-home"],
    offers: [
      {
        merchantSlug: "amazon",
        price: 649,
        originalPrice: 749,
        url: "https://www.amazon.com/dp/B08X591823?tag=dealbridge-20",
        shipping: "Free Prime 2-Day",
        condition: "Brand New",
      },
      {
        merchantSlug: "best-buy",
        price: 699,
        originalPrice: 749,
        url: "https://www.bestbuy.com/site/dyson-v15-detect-cordless-vacuum/6451299.p",
        shipping: "Free Shipping",
        condition: "Brand New",
      },
      {
        merchantSlug: "target",
        price: 749,
        originalPrice: 749,
        url: "https://www.target.com/p/dyson-v15-detect/-/A-82154910",
        shipping: "Free Delivery",
        condition: "Brand New",
      },
    ],
  },
];

const seedCatalog = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dealbridge";
    await mongoose.connect(mongoUri);
    console.log(`[SeedCatalog] Connected to MongoDB at: ${mongoUri}`);

    // 1. Seed or Upsert Merchants
    const merchantMap = {};
    for (const mData of merchantsData) {
      let merchant = await Merchant.findOne({ slug: mData.slug });
      if (!merchant) {
        merchant = await Merchant.create(mData);
        console.log(`[SeedCatalog] Created Merchant: ${merchant.name}`);
      } else {
        merchant = await Merchant.findByIdAndUpdate(merchant._id, mData, { new: true });
        console.log(`[SeedCatalog] Updated Merchant: ${merchant.name}`);
      }
      merchantMap[mData.slug] = merchant;
    }

    // 2. Seed Canonical Products & Attached Merchant Offers
    for (const pData of productsData) {
      const canonicalKey = Product.generateCanonicalKey(pData.brand, pData.model, pData.modelNumber);

      let product = await Product.findOne({ canonicalKey });
      const productPayload = {
        name: pData.name,
        slug: pData.slug,
        brand: pData.brand,
        model: pData.model,
        modelNumber: pData.modelNumber,
        canonicalKey,
        category: pData.category,
        description: pData.description,
        thumbnail: pData.thumbnail,
        images: pData.images,
        specifications: pData.specifications,
        tags: pData.tags,
        isAvailable: true,
      };

      if (!product) {
        product = await Product.create(productPayload);
        console.log(`[SeedCatalog] Created Canonical Product: ${product.name} (Key: ${canonicalKey})`);
      } else {
        product = await Product.findByIdAndUpdate(product._id, productPayload, { new: true });
        console.log(`[SeedCatalog] Updated Canonical Product: ${product.name}`);
      }

      // Associate Merchant Offers with canonical product
      const prices = [];
      for (const oData of pData.offers) {
        const merchant = merchantMap[oData.merchantSlug];
        if (!merchant) continue;

        prices.push(oData.price);

        const offerPayload = {
          product: product._id,
          merchant: merchant._id,
          merchantName: merchant.name,
          price: oData.price,
          originalPrice: oData.originalPrice || oData.price,
          externalUrl: oData.url,
          shipping: oData.shipping || "Standard Shipping",
          condition: oData.condition || "Brand New",
          inStock: true,
          isActive: true,
          lastUpdated: new Date(),
        };

        await MerchantOffer.findOneAndUpdate(
          { product: product._id, merchant: merchant._id },
          offerPayload,
          { upsert: true, new: true }
        );
      }

      // Compute & sync lowest price and offer counts
      if (prices.length > 0) {
        const lowestPrice = Math.min(...prices);
        const highestPrice = Math.max(...prices);
        await Product.findByIdAndUpdate(product._id, {
          lowestPrice,
          highestPrice,
          offerCount: prices.length,
          isAvailable: true,
        });
        console.log(`[SeedCatalog] Synced ${product.name} -> Lowest Price: $${lowestPrice} (${prices.length} offers)`);
      }
    }

    console.log("[SeedCatalog] Catalog seeding completed successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("[SeedCatalog] Error seeding catalog:", error);
    process.exit(1);
  }
};

seedCatalog();
