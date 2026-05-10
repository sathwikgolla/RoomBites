import Coupon from "../models/Coupon.js";

export async function validateCoupon(req, res, next) {
  try {
    const code = String(req.params.code || req.body.code || "").toUpperCase();
    const coupon = await Coupon.findOne({ code, active: true });
    if (!coupon || coupon.expiry < new Date()) {
      res.status(404);
      throw new Error("Coupon is invalid or expired");
    }
    res.json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
}

export async function listCoupons(req, res, next) {
  try {
    const coupons = await Coupon.find({ active: true }).sort("code");
    res.json({ success: true, coupons });
  } catch (error) {
    next(error);
  }
}
