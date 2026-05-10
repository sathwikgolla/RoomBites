import Order from "../models/Order.js";
import Review from "../models/Review.js";

export async function createReview(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.body.orderId, studentId: req.user._id });
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    if (order.status !== "delivered") {
      res.status(400);
      throw new Error("Only delivered orders can be reviewed");
    }
    if (!order.assignedDeliveryBoyId) {
      res.status(400);
      throw new Error("Order has no assigned delivery boy");
    }

    const review = await Review.create({
      studentId: req.user._id,
      orderId: order._id,
      deliveryBoyId: order.assignedDeliveryBoyId,
      items: order.items.map((item) => item.foodItemId),
      foodRating: req.body.foodRating,
      deliveryRating: req.body.deliveryRating,
      behaviorRating: req.body.behaviorRating,
      reviewText: req.body.reviewText,
    });

    order.reviewedAt = new Date();
    await order.save();

    res.status(201).json({ success: true, review });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      next(new Error("This order has already been reviewed"));
      return;
    }
    next(error);
  }
}

export async function myReviews(req, res, next) {
  try {
    const reviews = await Review.find({ studentId: req.user._id }).sort("-createdAt");
    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
}
