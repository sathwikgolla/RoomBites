import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      res.status(401);
      throw new Error("Not authorized, token missing");
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user || user.isCancelled || user.accountStatus === "cancelled") {
      res.status(401);
      throw new Error("Not authorized, account unavailable");
    }
    if (user.accountStatus !== "active") {
      res.status(403);
      throw new Error("Account unavailable");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
