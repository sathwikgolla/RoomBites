import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodCategory", required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    prepTime: { type: String, default: "10 min" },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

foodItemSchema.index({ categoryId: 1, slug: 1 }, { unique: true });

export default mongoose.model("FoodItem", foodItemSchema);
