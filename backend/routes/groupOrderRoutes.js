import express from "express";
import { addGroupItem, createGroupOrder, getGroupOrder, joinGroupOrder } from "../controllers/groupOrderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorize("student"));
router.post("/", createGroupOrder);
router.post("/join", joinGroupOrder);
router.get("/:code", getGroupOrder);
router.post("/:code/items", addGroupItem);

export default router;
