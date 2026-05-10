import express from "express";
import { body } from "express-validator";
import { createReview, myReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.use(protect);
router.post(
  "/",
  authorize("student"),
  [
    body("orderId").notEmpty(),
    body("foodRating").isInt({ min: 1, max: 5 }),
    body("deliveryRating").isInt({ min: 1, max: 5 }),
    body("behaviorRating").isInt({ min: 1, max: 5 }),
  ],
  validateRequest,
  createReview
);
router.get("/my-reviews", authorize("student"), myReviews);

export default router;
