import FoodCategory from "../models/FoodCategory.js";
import { slugify } from "../utils/slugify.js";

export async function getCategories(req, res, next) {
  try {
    const categories = await FoodCategory.find({ isActive: true }).sort({ displayOrder: 1, createdAt: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryBySlug(req, res, next) {
  try {
    const category = await FoodCategory.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const category = await FoodCategory.create({
      name: req.body.name,
      slug: req.body.slug || slugify(req.body.name),
      description: req.body.description,
      image: req.body.image,
      displayOrder: req.body.displayOrder,
    });
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const patch = { ...req.body };
    if (patch.name && !patch.slug) patch.slug = slugify(patch.name);
    const category = await FoodCategory.findByIdAndUpdate(req.params.id, patch, { new: true });
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    res.json({ success: true, category });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const category = await FoodCategory.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    res.json({ success: true, message: "Category deleted", category });
  } catch (error) {
    next(error);
  }
}
