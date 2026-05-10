import cloudinary from "../config/cloudinary.js";
import FoodCategory from "../models/FoodCategory.js";
import FoodItem from "../models/FoodItem.js";
import { slugify } from "../utils/slugify.js";

async function uploadToCloudinary(file) {
  if (!file) return null;
  const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(base64, { folder: "roombites/foods" });
  return result.secure_url;
}

export async function getFoods(req, res, next) {
  try {
    const query = {};
    if (req.query.available === "true") query.isAvailable = true;
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }
    if (req.query.search) query.name = { $regex: req.query.search, $options: "i" };
    if (req.query.category) {
      const category = await FoodCategory.findOne({ slug: req.query.category });
      query.categoryId = category?._id || null;
    }
    const foods = await FoodItem.find(query).populate("categoryId", "name slug").sort("name");
    res.json({ success: true, foods });
  } catch (error) {
    next(error);
  }
}

export async function getFoodsByCategory(req, res, next) {
  try {
    const category = await FoodCategory.findOne({ slug: req.params.categorySlug, isActive: true });
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    const foods = await FoodItem.find({ categoryId: category._id, isAvailable: true }).sort("name");
    res.json({ success: true, category, foods });
  } catch (error) {
    next(error);
  }
}

export async function getFoodById(req, res, next) {
  try {
    const food = await FoodItem.findById(req.params.id).populate("categoryId", "name slug");
    if (!food) {
      res.status(404);
      throw new Error("Food item not found");
    }
    res.json({ success: true, food });
  } catch (error) {
    next(error);
  }
}

export async function createFood(req, res, next) {
  try {
    const imageUrl = (await uploadToCloudinary(req.file)) || req.body.image;
    const food = await FoodItem.create({
      categoryId: req.body.categoryId,
      name: req.body.name,
      slug: req.body.slug || slugify(req.body.name),
      description: req.body.description,
      price: req.body.price,
      image: imageUrl,
      rating: req.body.rating,
      prepTime: req.body.prepTime,
    });
    res.status(201).json({ success: true, food });
  } catch (error) {
    next(error);
  }
}

export async function updateFood(req, res, next) {
  try {
    const patch = { ...req.body };
    if (req.file) patch.image = await uploadToCloudinary(req.file);
    if (patch.name && !patch.slug) patch.slug = slugify(patch.name);
    const food = await FoodItem.findByIdAndUpdate(req.params.id, patch, { new: true });
    if (!food) {
      res.status(404);
      throw new Error("Food item not found");
    }
    res.json({ success: true, food });
  } catch (error) {
    next(error);
  }
}

export async function deleteFood(req, res, next) {
  try {
    const food = await FoodItem.findByIdAndUpdate(req.params.id, { isAvailable: false }, { new: true });
    if (!food) {
      res.status(404);
      throw new Error("Food item not found");
    }
    res.json({ success: true, message: "Food item deleted", food });
  } catch (error) {
    next(error);
  }
}
