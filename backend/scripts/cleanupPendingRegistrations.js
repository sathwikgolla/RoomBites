import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import PendingRegistration from "../models/PendingRegistration.js";

dotenv.config();
await connectDB();

const result = await PendingRegistration.deleteMany({
  $or: [{ emailOtpExpires: { $lt: new Date() } }, { createdAt: { $lt: new Date(Date.now() - 15 * 60 * 1000) } }],
});

console.log(`Deleted ${result.deletedCount} expired pending registrations`);
process.exit(0);
