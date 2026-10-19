import express from "express";
import { updateOffer, deleteOffer } from "../controllers/offerController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All offer modification routes are restricted to administrators
router.use(protect, authorize("admin"));

router.put("/:id", updateOffer);
router.delete("/:id", deleteOffer);

export default router;
