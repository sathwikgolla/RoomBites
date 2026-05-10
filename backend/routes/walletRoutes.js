import express from "express";
import { balance, demoCredit, transactions } from "../controllers/walletController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/balance", protect, balance);
router.get("/transactions", protect, transactions);
router.post("/demo-credit", protect, authorize("admin"), demoCredit);

export default router;
