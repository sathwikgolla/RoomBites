import express from "express";
import { body } from "express-validator";
import {
  cancelAccount,
  changePassword,
  login,
  me,
  register,
  sendEmailOtpRoute,
  updateProfile,
  verifyEmailOtp,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post(
  "/register",
  [body("fullName").notEmpty(), body("email").isEmail(), body("password").isLength({ min: 6 }), body("role").isIn(["student", "delivery", "admin"])],
  validateRequest,
  register
);
router.post("/login", [body("email").isEmail(), body("password").notEmpty(), body("role").isIn(["student", "delivery", "admin"])], validateRequest, login);
router.post("/send-email-otp", [body("email").isEmail()], validateRequest, sendEmailOtpRoute);
router.post("/verify-email-otp", [body("email").isEmail(), body("otp").isLength({ min: 6, max: 6 })], validateRequest, verifyEmailOtp);
router.get("/me", protect, me);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, [body("currentPassword").notEmpty(), body("newPassword").isLength({ min: 6 })], validateRequest, changePassword);
router.put("/cancel-account", protect, cancelAccount);

export default router;
