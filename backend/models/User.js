import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ["student", "delivery", "admin"], required: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    walletBalance: { type: Number, default: 100000, min: 0 },
    isCancelled: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    accountStatus: {
      type: String,
      enum: ["pending_verification", "active", "cancelled"],
      default: "pending_verification",
    },
    studentId: { type: String, unique: true, sparse: true, trim: true },
    department: { type: String, trim: true },
    year: { type: String, trim: true },
    deliveryId: { type: String, unique: true, sparse: true, trim: true },
    availabilityStatus: { type: String, enum: ["available", "busy", "offline"], default: "available" },
    adminId: { type: String, unique: true, sparse: true, trim: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  if (this.password?.startsWith("$2")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function matchPassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
