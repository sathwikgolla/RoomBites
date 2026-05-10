import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    foodItemId: { type: mongoose.Schema.Types.ObjectId, ref: "FoodItem", required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentName: { type: String, required: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 15 },
    couponCode: { type: String, trim: true, uppercase: true },
    couponDiscount: { type: Number, default: 0 },
    originalTotalAmount: { type: Number, default: 0 },
    speedOption: { type: String, enum: ["5min", "10min", "15min", "20min"], required: true },
    speedCharge: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    floor: { type: String, required: true },
    roomNumber: { type: String, required: true },
    department: { type: String, required: true },
    phone: { type: String, required: true },
    deliveryNote: { type: String, default: "" },
    paymentMethod: { type: String, enum: ["demo_wallet"], default: "demo_wallet" },
    paymentStatus: { type: String, enum: ["paid", "refunded"], default: "paid" },
    status: {
      type: String,
      enum: ["pending", "assigned", "accepted", "out_for_delivery", "near_class", "waiting_confirmation", "delivered", "cancelled"],
      default: "pending",
    },
    assignedDeliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    assignedDeliveryBoyName: { type: String, default: null },
    studentSuccess: { type: Boolean, default: false },
    deliveryBoySuccess: { type: Boolean, default: false },
    acceptedAt: Date,
    outForDeliveryAt: Date,
    nearClassAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    reviewedAt: Date,
  },
  { timestamps: true }
);

orderSchema.index({ studentId: 1, createdAt: -1 });
orderSchema.index({ assignedDeliveryBoyId: 1, status: 1 });
orderSchema.index({ status: 1, createdAt: 1 });
orderSchema.index({ floor: 1, department: 1, status: 1 });

export default mongoose.model("Order", orderSchema);
