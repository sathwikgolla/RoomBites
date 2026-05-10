import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ["flat", "delivery", "speed"], default: "flat" },
    amount: { type: Number, required: true, min: 0 },
    expiry: { type: Date, required: true },
    active: { type: Boolean, default: true },
    minSubtotal: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
