import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Notification from "../models/Notification.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import WalletTransaction from "../models/WalletTransaction.js";

dotenv.config();
await connectDB();

await Promise.all([Order.deleteMany({}), Notification.deleteMany({}), WalletTransaction.deleteMany({}), Review.deleteMany({})]);

console.log("All order-related data deleted");
process.exit(0);
