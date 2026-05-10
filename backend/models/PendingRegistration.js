import mongoose from "mongoose";

const pendingRegistrationSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["student", "delivery", "admin"], required: true },
  phone: { type: String, trim: true },
  studentId: { type: String, trim: true },
  department: { type: String, trim: true },
  year: { type: String, trim: true },
  deliveryId: { type: String, trim: true },
  adminId: { type: String, trim: true },
  emailOtp: { type: String, required: true },
  emailOtpExpires: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now, expires: 900 },
});

export default mongoose.model("PendingRegistration", pendingRegistrationSchema);
