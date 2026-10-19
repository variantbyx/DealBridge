import express from "express";
import { handleRedirect, recordClickBeacon } from "../controllers/redirectController.js";

const router = express.Router();

router.get("/:offerId", handleRedirect);
router.post("/click", recordClickBeacon);

export default router;
