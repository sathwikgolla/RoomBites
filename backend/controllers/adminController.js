import Order from "../models/Order.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import { assignPendingOrders } from "../utils/assignPendingOrders.js";
import { refundOrder } from "./orderController.js";

export async function dashboard(req, res, next) {
  try {
    const activeStatuses = ["pending", "assigned", "accepted", "out_for_delivery", "near_class", "waiting_confirmation"];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [
      totalStudents,
      totalDeliveryBoys,
      activeDeliveryBoys,
      totalOrders,
      todayOrders,
      pendingOrders,
      assignedOrders,
      acceptedOrders,
      nearClassOrders,
      deliveredOrders,
      cancelledOrders,
      revenueAgg,
      deliveryBoys,
      avgDeliveryAgg,
    ] =
      await Promise.all([
        User.countDocuments({ role: "student", isCancelled: false }),
        User.countDocuments({ role: "delivery", isCancelled: false }),
        User.countDocuments({ role: "delivery", isCancelled: false, availabilityStatus: "available" }),
        Order.countDocuments(),
        Order.countDocuments({ createdAt: { $gte: today } }),
        Order.countDocuments({ status: "pending" }),
        Order.countDocuments({ status: "assigned" }),
        Order.countDocuments({ status: "accepted" }),
        Order.countDocuments({ status: "near_class" }),
        Order.countDocuments({ status: "delivered" }),
        Order.countDocuments({ status: "cancelled" }),
        Order.aggregate([{ $match: { status: { $ne: "cancelled" } } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
        User.find({ role: "delivery", isCancelled: false }).select("fullName email deliveryId availabilityStatus").sort("deliveryId"),
        Order.aggregate([
          { $match: { status: "delivered", acceptedAt: { $ne: null }, deliveredAt: { $ne: null } } },
          { $project: { minutes: { $divide: [{ $subtract: ["$deliveredAt", "$acceptedAt"] }, 60000] } } },
          { $group: { _id: null, average: { $avg: "$minutes" } } },
        ]),
      ]);

    const deliveryLoad = await Promise.all(
      deliveryBoys.map(async (boy) => ({
        deliveryBoyId: boy._id,
        deliveryBoyName: boy.fullName,
        deliveryId: boy.deliveryId,
        availabilityStatus: boy.availabilityStatus,
        activeOrderCount: await Order.countDocuments({ assignedDeliveryBoyId: boy._id, status: { $in: activeStatuses } }),
      }))
    );

    const [ordersByCategory, revenueChart, peakHours, deliveryPerformance, mostOrderedFoods, topDeliveryBoys, lowRatedFoods, heatmapFloors, heatmapDepartments] = await Promise.all([
      Order.aggregate([
        { $unwind: "$items" },
        { $lookup: { from: "fooditems", localField: "items.foodItemId", foreignField: "_id", as: "food" } },
        { $unwind: "$food" },
        { $lookup: { from: "foodcategories", localField: "food.categoryId", foreignField: "_id", as: "category" } },
        { $unwind: "$category" },
        { $group: { _id: "$category.name", orders: { $sum: "$items.quantity" } } },
        { $project: { _id: 0, name: "$_id", orders: 1 } },
        { $sort: { orders: -1 } },
        { $limit: 8 },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, revenue: { $sum: "$totalAmount" }, orders: { $sum: 1 } } },
        { $project: { _id: 0, date: "$_id", revenue: 1, orders: 1 } },
        { $sort: { date: 1 } },
        { $limit: 14 },
      ]),
      Order.aggregate([{ $group: { _id: { $hour: "$createdAt" }, orders: { $sum: 1 } } }, { $project: { _id: 0, hour: "$_id", orders: 1 } }, { $sort: { hour: 1 } }]),
      Order.aggregate([
        { $match: { status: "delivered", assignedDeliveryBoyName: { $ne: null } } },
        { $group: { _id: "$assignedDeliveryBoyName", delivered: { $sum: 1 } } },
        { $project: { _id: 0, name: "$_id", delivered: 1 } },
        { $sort: { delivered: -1 } },
        { $limit: 8 },
      ]),
      Order.aggregate([
        { $unwind: "$items" },
        { $group: { _id: "$items.name", quantity: { $sum: "$items.quantity" } } },
        { $project: { _id: 0, name: "$_id", quantity: 1 } },
        { $sort: { quantity: -1 } },
        { $limit: 8 },
      ]),
      Review.aggregate([
        { $group: { _id: "$deliveryBoyId", rating: { $avg: "$deliveryRating" }, reviews: { $sum: 1 } } },
        { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "boy" } },
        { $unwind: "$boy" },
        { $project: { _id: 0, name: "$boy.fullName", rating: { $round: ["$rating", 1] }, reviews: 1 } },
        { $sort: { rating: -1, reviews: -1 } },
        { $limit: 5 },
      ]),
      Review.aggregate([
        { $unwind: "$items" },
        { $group: { _id: "$items", rating: { $avg: "$foodRating" }, reviews: { $sum: 1 } } },
        { $lookup: { from: "fooditems", localField: "_id", foreignField: "_id", as: "food" } },
        { $unwind: "$food" },
        { $project: { _id: 0, name: "$food.name", rating: { $round: ["$rating", 1] }, reviews: 1 } },
        { $sort: { rating: 1, reviews: -1 } },
        { $limit: 5 },
      ]),
      Order.aggregate([{ $group: { _id: "$floor", orders: { $sum: 1 } } }, { $project: { _id: 0, name: "$_id", orders: 1 } }, { $sort: { orders: -1 } }, { $limit: 8 }]),
      Order.aggregate([{ $group: { _id: "$department", orders: { $sum: 1 } } }, { $project: { _id: 0, name: "$_id", orders: 1 } }, { $sort: { orders: -1 } }, { $limit: 8 }]),
    ]);

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalDeliveryBoys,
        activeDeliveryBoys,
        busyDeliveryBoys: totalDeliveryBoys - activeDeliveryBoys,
        totalOrders,
        todayOrders,
        pendingOrders,
        unassignedPendingOrders: pendingOrders,
        assignedOrders,
        acceptedOrders,
        nearClassOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: revenueAgg[0]?.total || 0,
        averageDeliveryTime: Math.round(avgDeliveryAgg[0]?.average || 0),
        smartGroupedMinutesSavedToday: assignedOrders * 3,
        deliveryLoad,
      },
      analytics: {
        ordersByCategory,
        revenueChart,
        peakHours,
        deliveryPerformance,
        mostOrderedFoods,
        topDeliveryBoys,
        lowRatedFoods,
        heatmapFloors,
        heatmapDepartments,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function users(req, res, next) {
  try {
    const filter = req.query.role ? { role: req.query.role } : {};
    const list = await User.find(filter).select("-password").sort("-createdAt");
    res.json({ success: true, users: list });
  } catch (error) {
    next(error);
  }
}

export async function orders(req, res, next) {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.student) filter.studentId = req.query.student;
    if (req.query.deliveryBoy) filter.assignedDeliveryBoyId = req.query.deliveryBoy;
    if (req.query.from || req.query.to) {
      filter.createdAt = {};
      if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
    }
    const list = await Order.find(filter).sort("-createdAt");
    res.json({ success: true, orders: list });
  } catch (error) {
    next(error);
  }
}

export async function cancelAnyOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    await refundOrder(order);
    await assignPendingOrders();
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

export async function markDelivered(req, res, next) {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "delivered", studentSuccess: true, deliveryBoySuccess: true, deliveredAt: new Date() },
      { new: true }
    );
    await assignPendingOrders();
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isCancelled: true }, { new: true }).select("-password");
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
}
