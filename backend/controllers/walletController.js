import User from "../models/User.js";
import WalletTransaction from "../models/WalletTransaction.js";

export async function balance(req, res) {
  res.json({ success: true, walletBalance: req.user.walletBalance });
}

export async function transactions(req, res, next) {
  try {
    const list = await WalletTransaction.find({ userId: req.user._id }).sort("-createdAt");
    res.json({ success: true, transactions: list });
  } catch (error) {
    next(error);
  }
}

export async function demoCredit(req, res, next) {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const amount = Number(req.body.amount);
    user.walletBalance += amount;
    await user.save();
    const transaction = await WalletTransaction.create({
      userId: user._id,
      type: "credit",
      amount,
      balanceAfter: user.walletBalance,
      description: req.body.description || "Admin wallet credit",
    });
    res.json({ success: true, user, transaction });
  } catch (error) {
    next(error);
  }
}
