import mongoose from "mongoose";

const groupOrderItemSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem", required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const groupOrderSchema = new mongoose.Schema(
  {
    groupCode: { type: String, required: true, unique: true, uppercase: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    items: [groupOrderItemSchema],
    finalOrderStatus: { type: String, enum: ["open", "checked_out", "cancelled"], default: "open" },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
  },
  { timestamps: true }
);

groupOrderSchema.index({ groupCode: 1 });
groupOrderSchema.index({ ownerId: 1, createdAt: -1 });

export default mongoose.model("GroupOrder", groupOrderSchema);
