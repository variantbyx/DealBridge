import express from "express";
import {
  getProducts,
  getProductByIdOrSlug,
  getProductOffers,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductAvailability,
} from "../controllers/productController.js";
import { addOfferToProduct } from "../controllers/offerController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/categories", getCategories);
router.get("/", getProducts);
router.get("/:idOrSlug", getProductByIdOrSlug);
router.get("/:id/offers", getProductOffers);

// Protected Admin-only routes
router.post("/", protect, authorize("admin"), createProduct);
router.put("/:id", protect, authorize("admin"), updateProduct);
router.delete("/:id", protect, authorize("admin"), deleteProduct);
router.patch("/:id/availability", protect, authorize("admin"), toggleProductAvailability);
router.post("/:id/offers", protect, authorize("admin"), addOfferToProduct);

export default router;
