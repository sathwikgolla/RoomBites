import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

await connectDB();

try {
  await User.collection.dropIndexes();
} catch (error) {
  if (error.codeName !== "NamespaceNotFound") throw error;
}

await User.syncIndexes();
console.log("User indexes reset and recreated");
process.exit(0);
