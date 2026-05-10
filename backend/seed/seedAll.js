import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import FoodCategory from "../models/FoodCategory.js";
import FoodItem from "../models/FoodItem.js";
import Coupon from "../models/Coupon.js";
import GroupOrder from "../models/GroupOrder.js";
import Notification from "../models/Notification.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import WalletTransaction from "../models/WalletTransaction.js";
import { seedUsers } from "./seedAdmin.js";
import { seedCategories } from "./seedCategories.js";
import { seedFoodItems } from "./seedFoodItems.js";

dotenv.config();

await connectDB();
await Order.deleteMany({});
await Review.deleteMany({});
await GroupOrder.deleteMany({});
await Notification.deleteMany({});
await WalletTransaction.deleteMany({});
await Coupon.deleteMany({});
await FoodItem.deleteMany({});
await FoodCategory.deleteMany({});
await seedUsers();
await seedCategories();
await seedFoodItems();
await Coupon.insertMany([
  { code: "WELCOME50", discountType: "flat", amount: 50, expiry: new Date("2035-12-31"), active: true },
  { code: "FREEDEL", discountType: "delivery", amount: 15, expiry: new Date("2035-12-31"), active: true },
  { code: "FAST10", discountType: "speed", amount: 10, expiry: new Date("2035-12-31"), active: true },
]);
console.log("RoomBites seed complete");
process.exit(0);
