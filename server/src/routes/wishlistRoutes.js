import express from "express";
import {
  getWishlist,
  getWishlistIds,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All wishlist routes require authentication (Module 4 access control)
router.use(protect);

router.get("/", getWishlist);
router.get("/ids", getWishlistIds);
router.post("/:productId", addToWishlist);
router.delete("/:productId", removeFromWishlist);
router.delete("/", clearWishlist);

export default router;
