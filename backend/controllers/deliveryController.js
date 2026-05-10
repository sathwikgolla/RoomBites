import Order from "../models/Order.js";
import User from "../models/User.js";
import { assignPendingOrders } from "../utils/assignPendingOrders.js";
import { createNotification } from "../utils/createNotification.js";

const activeAssignedStatuses = ["assigned", "accepted", "out_for_delivery", "near_class", "waiting_confirmation"];

export async function availableOrders(req, res, next) {
  try {
    const orders = await Order.find({ status: "pending", assignedDeliveryBoyId: null }).sort("-createdAt");
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
}

export async function acceptOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    if (order.assignedDeliveryBoyId?.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("This order is assigned to another delivery boy");
    }
    if (order.status !== "assigned") {
      res.status(400);
      throw new Error("Only assigned orders can be accepted");
    }
    order.status = "accepted";
    order.acceptedAt = new Date();
    await order.save();
    await createNotification({
      userId: order.studentId,
      title: "Order accepted",
      message: `Your order has been accepted by ${req.user.fullName}.`,
      type: "order_accepted",
    });
    res.json({ success: true, message: "Order accepted successfully", order });
  } catch (error) {
    next(error);
  }
}

export async function outForDelivery(req, res, next) {
  try {
    const order = await assignedOrder(req, res);
    if (order.status !== "accepted") {
      res.status(400);
      throw new Error("Only accepted orders can be marked out for delivery");
    }
    order.status = "out_for_delivery";
    order.outForDeliveryAt = new Date();
    await order.save();
    await createNotification({
      userId: order.studentId,
      title: "Order out for delivery",
      message: "Your order is out for delivery.",
      type: "order",
    });
    res.json({ success: true, message: "Order marked out for delivery", order });
  } catch (error) {
    next(error);
  }
}

export async function nearClass(req, res, next) {
  try {
    const order = await assignedOrder(req, res);
    if (order.status !== "out_for_delivery") {
      res.status(400);
      throw new Error("Only out-for-delivery orders can be marked near class");
    }
    order.status = "near_class";
    order.nearClassAt = new Date();
    await order.save();
    await createNotification({
      userId: order.studentId,
      title: "Delivery is near your class",
      message: `${req.user.fullName} is almost at ${order.floor}, room ${order.roomNumber}.`,
      type: "near_class",
    });
    res.json({ success: true, message: "Order marked near classroom", order });
  } catch (error) {
    next(error);
  }
}

export async function deliverySuccess(req, res, next) {
  try {
    const order = await assignedOrder(req, res);
    if (!["out_for_delivery", "near_class", "waiting_confirmation"].includes(order.status)) {
      res.status(400);
      throw new Error("Only active delivery orders can be completed");
    }
    order.deliveryBoySuccess = true;
    if (order.studentSuccess) {
      order.status = "delivered";
      order.deliveredAt = new Date();
      await createNotification({
        userId: order.studentId,
        title: "Order delivered",
        message: `Order ${order.orderId} was delivered successfully.`,
        type: "delivered",
      });
      await createNotification({
        userId: order.studentId,
        title: "Rate your order",
        message: `Your order ${order.orderId} is delivered. Share your RoomBites rating.`,
        type: "review_request",
      });
    } else {
      order.status = "waiting_confirmation";
    }
    await order.save();
    if (order.status === "delivered") await assignPendingOrders();
    res.json({ success: true, message: order.status === "delivered" ? "Order delivered successfully" : "Waiting for student confirmation", order });
  } catch (error) {
    next(error);
  }
}

export async function myDeliveryOrders(req, res, next) {
  try {
    if (!req.user.availabilityStatus) {
      await User.findByIdAndUpdate(req.user._id, { availabilityStatus: "available" });
      req.user.availabilityStatus = "available";
      await assignPendingOrders();
    } else if (req.user.availabilityStatus === "available") {
      await assignPendingOrders();
    }
    const orders = await Order.find({
      assignedDeliveryBoyId: req.user._id,
      status: { $in: activeAssignedStatuses },
    }).sort("-createdAt");
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
}

export async function getEarnings(req, res, next) {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const deliveredOrders = await Order.find({
      assignedDeliveryBoyId: req.user._id,
      status: "delivered",
    }).sort({ deliveredAt: -1 });

    const todayOrders = deliveredOrders.filter((order) => new Date(order.deliveredAt || order.updatedAt) >= startOfDay);
    const earningFor = (order) => 20 + (order.speedOption === "5min" ? 10 : order.speedOption === "10min" ? 5 : 0);
    const averageDeliveryTime =
      deliveredOrders.length === 0
        ? 0
        : Math.round(
            deliveredOrders.reduce((sum, order) => {
              const start = new Date(order.acceptedAt || order.createdAt).getTime();
              const end = new Date(order.deliveredAt || order.updatedAt).getTime();
              return sum + Math.max(0, end - start);
            }, 0) /
              deliveredOrders.length /
              60000
          );

    res.json({
      success: true,
      earnings: {
        completedToday: todayOrders.length,
        totalCompleted: deliveredOrders.length,
        todayEarnings: todayOrders.reduce((sum, order) => sum + earningFor(order), 0),
        totalEarnings: deliveredOrders.reduce((sum, order) => sum + earningFor(order), 0),
        averageDeliveryTime,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getCompletedOrders(req, res, next) {
  try {
    const orders = await Order.find({
      assignedDeliveryBoyId: req.user._id,
      status: "delivered",
    })
      .populate("studentId", "fullName email")
      .populate("items.foodItemId", "name image")
      .sort({ deliveredAt: -1, createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
}

export async function updateAvailability(req, res, next) {
  try {
    const allowedStatuses = ["available", "busy", "offline"];
    if (!allowedStatuses.includes(req.body.availabilityStatus)) {
      res.status(400);
      throw new Error("availabilityStatus must be available, busy, or offline");
    }

    const user = await User.findByIdAndUpdate(req.user._id, { availabilityStatus: req.body.availabilityStatus }, { new: true }).select("-password");
    const assignedOrders = req.body.availabilityStatus === "available" ? await assignPendingOrders() : [];

    res.json({
      success: true,
      message: "Availability updated",
      availabilityStatus: user.availabilityStatus,
      assignedOrders,
      user,
    });
  } catch (error) {
    next(error);
  }
}

async function assignedOrder(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order || order.assignedDeliveryBoyId?.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error("Assigned order not found");
  }
  return order;
}
