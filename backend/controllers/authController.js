import bcrypt from "bcrypt";
import PendingRegistration from "../models/PendingRegistration.js";
import User from "../models/User.js";
import { generateOtp, otpExpiry } from "../utils/generateOtp.js";
import { generateToken } from "../utils/generateToken.js";
import { sendEmailOtp } from "../utils/sendEmailOtp.js";

const AUTHORIZED_ADMIN_EMAIL = "sathwikgolla06@gmail.com";
const clean = (value) => (typeof value === "string" ? value.trim() : value);
const isGmail = (email) => typeof email === "string" && email.toLowerCase().endsWith("@gmail.com");

function authError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateRoleFields(body) {
  if (!["student", "delivery", "admin"].includes(body.role)) {
    throw authError("Invalid role selected");
  }
  if (body.role === "student" && (!body.studentId || !body.department || !body.year || !body.phone)) {
    throw authError("Student registration requires studentId, department, year, and phone");
  }
  if (body.role === "student" && (body.deliveryId || body.adminId)) {
    throw authError("Student account cannot include delivery or admin ID");
  }
  if (body.role === "delivery" && (!body.deliveryId || !body.phone)) {
    throw authError("Delivery boy registration requires deliveryId and phone");
  }
  if (body.role === "delivery" && (body.studentId || body.adminId)) {
    throw authError("Delivery account cannot include student or admin ID");
  }
  if (body.role === "admin" && !body.adminId) {
    throw authError("Admin registration requires adminId");
  }
  if (body.role === "admin" && (body.studentId || body.deliveryId)) {
    throw authError("Admin account cannot include student or delivery ID");
  }
  if (["student", "delivery"].includes(body.role) && !isGmail(body.email)) {
    throw authError("Only Gmail accounts are allowed");
  }
  if (body.role === "admin" && body.email !== AUTHORIZED_ADMIN_EMAIL) {
    throw authError("Unauthorized admin email", 403);
  }
}

async function assertUniqueIdentifiers(body) {
  const checks = [
    ["email", body.email, "Email already registered"],
    ["phone", body.phone, "Phone number already in use"],
    ["studentId", body.studentId, "Student ID already exists"],
    ["deliveryId", body.deliveryId, "Delivery ID already exists"],
    ["adminId", body.adminId, "Admin ID already exists"],
  ].filter(([, value]) => value);

  for (const [field, value, message] of checks) {
    const exists = await User.exists({ [field]: value });
    if (exists) {
      const error = new Error(message);
      error.statusCode = 409;
      throw error;
    }
  }
}

async function assertUniqueAgainstUsers(body) {
  await assertUniqueIdentifiers(body);
}

const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  return obj;
};

async function createPendingEmailOtp(email) {
  const otp = generateOtp();
  await sendEmailOtp(email, otp);
  return otp;
}

export async function register(req, res, next) {
  try {
    const body = {
      ...req.body,
      fullName: clean(req.body.fullName),
      email: clean(req.body.email)?.toLowerCase(),
      phone: clean(req.body.phone),
      studentId: clean(req.body.studentId),
      deliveryId: clean(req.body.deliveryId),
      adminId: clean(req.body.adminId),
      department: clean(req.body.department),
      year: clean(req.body.year),
    };
    validateRoleFields(body);
    await assertUniqueAgainstUsers(body);
    await PendingRegistration.deleteOne({ email: body.email });

    const passwordHash = await bcrypt.hash(body.password, 12);
    const emailOtp = await createPendingEmailOtp(body.email);

    await PendingRegistration.create({
      fullName: body.fullName,
      email: body.email,
      passwordHash,
      role: body.role,
      phone: ["student", "delivery"].includes(body.role) ? body.phone : undefined,
      studentId: body.role === "student" ? body.studentId : undefined,
      department: body.role === "student" ? body.department : undefined,
      year: body.role === "student" ? body.year : undefined,
      deliveryId: body.role === "delivery" ? body.deliveryId : undefined,
      adminId: body.role === "admin" ? body.adminId : undefined,
      emailOtp,
      emailOtpExpires: otpExpiry(),
    });

    res.status(201).json({
      success: true,
      message: "OTP sent to email. Please verify to complete registration.",
      email: body.email,
      role: body.role,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    if (!req.body.role) {
      res.status(400);
      throw new Error("Role is required for login");
    }
    const email = clean(req.body.email)?.toLowerCase();
    if (["student", "delivery"].includes(req.body.role) && !isGmail(email)) {
      res.status(400);
      throw new Error("Only Gmail accounts are allowed");
    }
    if (req.body.role === "admin" && email !== AUTHORIZED_ADMIN_EMAIL) {
      res.status(403);
      throw new Error("Unauthorized admin access");
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(404);
      throw new Error("Account not found. Please register.");
    }
    if (!(await user.matchPassword(req.body.password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }
    if (user.isCancelled) {
      res.status(403);
      throw new Error("This account has been cancelled");
    }
    if (!user.emailVerified) {
      res.status(403);
      throw new Error("Please verify your email before login");
    }
    if (user.accountStatus !== "active") {
      res.status(403);
      throw new Error("Account verification pending");
    }
    if (req.body.role && user.role !== req.body.role) {
      res.status(403);
      const label = req.body.role === "student" ? "student" : req.body.role === "delivery" ? "delivery" : "admin";
      throw new Error(`Invalid ${label} account`);
    }
    res.json({ success: true, token: generateToken(user._id), user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function sendEmailOtpRoute(req, res, next) {
  try {
    const email = clean(req.body.email)?.toLowerCase();
    const pending = await PendingRegistration.findOne({ email });
    if (!pending) {
      res.status(404);
      throw new Error("Registration expired. Please register again.");
    }
    const emailOtp = await createPendingEmailOtp(email);
    pending.emailOtp = emailOtp;
    pending.emailOtpExpires = otpExpiry();
    pending.createdAt = new Date();
    await pending.save();
    res.json({ success: true, message: "Email OTP sent" });
  } catch (error) {
    next(error);
  }
}

export async function verifyEmailOtp(req, res, next) {
  try {
    const email = clean(req.body.email)?.toLowerCase();
    const otp = clean(req.body.otp);
    const pending = await PendingRegistration.findOne({ email });
    if (!pending) {
      res.status(404);
      throw new Error("Registration expired. Please register again.");
    }
    const valid = pending.emailOtp === otp && pending.emailOtpExpires && pending.emailOtpExpires > new Date();
    if (!valid) {
      res.status(400);
      throw new Error("Invalid or expired email OTP");
    }
    const body = pending.toObject();
    await assertUniqueAgainstUsers(body);
    const user = await User.create({
      fullName: body.fullName,
      email: body.email,
      password: body.passwordHash,
      role: body.role,
      phone: body.phone,
      studentId: body.studentId,
      department: body.department,
      year: body.year,
      deliveryId: body.deliveryId,
      adminId: body.adminId,
      emailVerified: true,
      accountStatus: "active",
      availabilityStatus: body.role === "delivery" ? "available" : undefined,
      isCancelled: false,
      walletBalance: 100000,
    });
    await PendingRegistration.deleteOne({ email });
    res.json({
      success: true,
      message: "Email verified. Account created successfully.",
      token: generateToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.json({ success: true, user: req.user });
}

export async function updateProfile(req, res, next) {
  try {
    const allowed = ["fullName", "phone", "department", "year", "availabilityStatus"];
    const patch = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) patch[field] = clean(req.body[field]);
    });
    if (patch.phone) {
      const existing = await User.exists({ phone: patch.phone, _id: { $ne: req.user._id } });
      if (existing) {
        res.status(409);
        throw new Error("Phone number already in use");
      }
    }
    const user = await User.findByIdAndUpdate(req.user._id, patch, { new: true }).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.matchPassword(req.body.currentPassword))) {
      res.status(400);
      throw new Error("Current password is incorrect");
    }
    user.password = req.body.newPassword;
    await user.save();
    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
}

export async function cancelAccount(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { isCancelled: true }, { new: true }).select("-password");
    res.json({ success: true, message: "Account cancelled successfully", user });
  } catch (error) {
    next(error);
  }
}
