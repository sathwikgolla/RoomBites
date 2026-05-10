import express from "express";
import { listCoupons, validateCoupon } from "../controllers/couponController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", listCoupons);
router.get("/:code", protect, validateCoupon);

export default router;
