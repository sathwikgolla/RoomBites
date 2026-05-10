import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import FoodCategory from "../models/FoodCategory.js";
import { categories } from "./data.js";

dotenv.config();

export async function seedCategories() {
  await FoodCategory.deleteMany({});
  const docs = await FoodCategory.insertMany(
    categories.map(([name, slug, description, image], index) => ({
      name,
      slug,
      description,
      image,
      displayOrder: index + 1,
      isActive: true,
    }))
  );
  console.log(`Seeded ${docs.length} categories`);
  return docs;
}

if (process.argv[1].endsWith("seedCategories.js")) {
  await connectDB();
  await seedCategories();
  process.exit(0);
}
