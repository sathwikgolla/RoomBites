import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "FoodItem" }],
    foodRating: { type: Number, required: true, min: 1, max: 5 },
    deliveryRating: { type: Number, required: true, min: 1, max: 5 },
    behaviorRating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

reviewSchema.index({ orderId: 1 }, { unique: true });
reviewSchema.index({ deliveryBoyId: 1, createdAt: -1 });
reviewSchema.index({ items: 1 });

export default mongoose.model("Review", reviewSchema);
