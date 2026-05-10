import express from "express";
import { cancelAnyOrder, dashboard, deleteUser, markDelivered, orders, users } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/dashboard", dashboard);
router.get("/users", users);
router.get("/orders", orders);
router.put("/orders/:id/cancel", cancelAnyOrder);
router.put("/orders/:id/mark-delivered", markDelivered);
router.delete("/users/:id", deleteUser);

export default router;
