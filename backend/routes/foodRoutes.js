import express from "express";
import { createFood, deleteFood, getFoodById, getFoods, getFoodsByCategory, updateFood } from "../controllers/foodController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getFoods);
router.get("/category/:categorySlug", getFoodsByCategory);
router.get("/:id", getFoodById);
router.post("/", protect, authorize("admin"), upload.single("image"), createFood);
router.put("/:id", protect, authorize("admin"), upload.single("image"), updateFood);
router.delete("/:id", protect, authorize("admin"), deleteFood);

export default router;
