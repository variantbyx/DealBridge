import express from "express";
import { getAdminStats, getAllMerchants } from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Enforce admin privileges on all admin endpoints
router.use(protect, authorize("admin"));

router.get("/stats", getAdminStats);
router.get("/analytics", getAdminStats);
router.get("/merchants", getAllMerchants);

export default router;
