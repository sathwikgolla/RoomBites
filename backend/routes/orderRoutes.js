import express from "express";
import { body } from "express-validator";
import { cancelOrder, getOrder, listOrders, myOrders, placeOrder, studentSuccess } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("student"),
  [body("items").isArray({ min: 1 }), body("speedOption").isIn(["5min", "10min", "15min", "20min"]), body("floor").notEmpty(), body("roomNumber").notEmpty()],
  validateRequest,
  placeOrder
);
router.get("/", protect, listOrders);
router.get("/my-orders", protect, authorize("student"), myOrders);
router.get("/:id", protect, getOrder);
router.put("/:id/cancel", protect, authorize("student", "admin"), cancelOrder);
router.put("/:id/student-success", protect, authorize("student"), studentSuccess);

export default router;
