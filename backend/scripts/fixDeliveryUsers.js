import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

dotenv.config();
await connectDB();

const result = await User.updateMany(
  { role: "delivery" },
  {
    $set: {
      availabilityStatus: "available",
      accountStatus: "active",
      emailVerified: true,
      isCancelled: false,
    },
  }
);

console.log(`Fixed ${result.modifiedCount} delivery users`);
process.exit(0);
