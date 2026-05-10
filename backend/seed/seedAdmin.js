import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

export async function seedUsers() {
  await User.deleteMany({
    email: { $regex: /(demo|roombites\.demo)/i },
  });
  console.log("Removed demo users. Real users must register through the app.");
  return [];
}

if (process.argv[1].endsWith("seedAdmin.js")) {
  await connectDB();
  await seedUsers();
  process.exit(0);
}
