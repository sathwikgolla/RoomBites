import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Notification from "../models/Notification.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import WalletTransaction from "../models/WalletTransaction.js";

dotenv.config();

await connectDB();

const demoUsers = await User.find({
  email: { $regex: /(demo|roombites\.demo)/i },
}).select("_id email");

const demoUserIds = demoUsers.map((user) => user._id);

if (demoUserIds.length) {
  await Promise.all([
    Notification.deleteMany({ userId: { $in: demoUserIds } }),
    WalletTransaction.deleteMany({ userId: { $in: demoUserIds } }),
    Order.deleteMany({
      $or: [{ studentId: { $in: demoUserIds } }, { assignedDeliveryBoyId: { $in: demoUserIds } }],
    }),
    User.deleteMany({ _id: { $in: demoUserIds } }),
  ]);
}

console.log(`Removed ${demoUsers.length} demo users`);
process.exit(0);
