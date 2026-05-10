import express from "express";
import {
  acceptOrder,
  availableOrders,
  deliverySuccess,
  getCompletedOrders,
  getEarnings,
  myDeliveryOrders,
  nearClass,
  outForDelivery,
  updateAvailability,
} from "../controllers/deliveryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorize("delivery"));
router.get("/available-orders", availableOrders);
router.get("/completed-orders", getCompletedOrders);
router.get("/earnings", getEarnings);
router.get("/my-orders", myDeliveryOrders);
router.put("/orders/:id/accept", acceptOrder);
router.put("/orders/:id/out-for-delivery", outForDelivery);
router.put("/orders/:id/near-class", nearClass);
router.put("/orders/:id/success", deliverySuccess);
router.put("/status", updateAvailability);

export default router;
