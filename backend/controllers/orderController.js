import FoodItem from "../models/FoodItem.js";
import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import WalletTransaction from "../models/WalletTransaction.js";
import { assignDeliveryBoy } from "../utils/assignDeliveryBoy.js";
import { assignPendingOrders } from "../utils/assignPendingOrders.js";
import { calculateOrderTotal } from "../utils/calculateOrderTotal.js";
import { createNotification } from "../utils/createNotification.js";
import { generateOrderId } from "../utils/generateOrderId.js";

async function buildOrderItems(items) {
  const ids = items.map((item) => item.foodItemId);
  const foods = await FoodItem.find({ _id: { $in: ids }, isAvailable: true });
  const byId = new Map(foods.map((food) => [food._id.toString(), food]));

  return items.map((item) => {
    const food = byId.get(item.foodItemId);
    if (!food) throw new Error("One or more food items are unavailable");
    const quantity = Number(item.quantity);
    if (!quantity || quantity < 1) throw new Error("Invalid item quantity");
    return {
      foodItemId: food._id,
      name: food.name,
      image: food.image,
      price: food.price,
      quantity,
      total: food.price * quantity,
    };
  });
}

export async function placeOrder(req, res, next) {
  try {
    const orderItems = await buildOrderItems(req.body.items || []);
    const totals = calculateOrderTotal(orderItems, req.body.speedOption);
    let coupon = null;
    let couponDiscount = 0;
    const originalTotalAmount = totals.totalAmount;
    if (req.body.couponCode) {
      coupon = await Coupon.findOne({ code: String(req.body.couponCode).toUpperCase(), active: true });
      if (!coupon || coupon.expiry < new Date()) {
        res.status(400);
        throw new Error("Invalid or expired coupon");
      }
      if (totals.subtotal < coupon.minSubtotal) {
        res.status(400);
        throw new Error(`Coupon requires subtotal of at least ${coupon.minSubtotal}`);
      }
      if (coupon.discountType === "delivery") couponDiscount = Math.min(totals.deliveryCharge, coupon.amount);
      else if (coupon.discountType === "speed") couponDiscount = Math.min(totals.speedCharge, coupon.amount);
      else couponDiscount = coupon.amount;
      totals.totalAmount = Math.max(0, totals.totalAmount - couponDiscount);
    }
    const student = await User.findById(req.user._id);

    if (student.walletBalance < totals.totalAmount) {
      res.status(400);
      throw new Error("Insufficient wallet balance");
    }

    student.walletBalance -= totals.totalAmount;
    await student.save();
    const assignedBoy = await assignDeliveryBoy(req.body);

    const createdOrder = await Order.create({
      orderId: generateOrderId(),
      studentId: student._id,
      studentName: student.fullName,
      items: orderItems,
      ...totals,
      speedOption: req.body.speedOption,
      floor: req.body.floor,
      roomNumber: req.body.roomNumber,
      department: req.body.department,
      phone: req.body.phone,
      deliveryNote: req.body.deliveryNote,
      couponCode: coupon?.code,
      couponDiscount,
      originalTotalAmount,
      status: assignedBoy ? "assigned" : "pending",
      assignedDeliveryBoyId: assignedBoy?._id || null,
      assignedDeliveryBoyName: assignedBoy?.fullName || null,
    });

    await WalletTransaction.create({
      userId: student._id,
      orderId: createdOrder.orderId,
      type: "debit",
      amount: totals.totalAmount,
      balanceAfter: student.walletBalance,
      description: `Payment for order ${createdOrder.orderId}`,
    });

    await createNotification({
      userId: student._id,
      title: assignedBoy ? "Order assigned" : "Order placed successfully",
      message: assignedBoy
        ? `Your order ${createdOrder.orderId} has been assigned to ${assignedBoy.fullName}.`
        : `Your order ${createdOrder.orderId} is placed. Waiting for delivery assignment.`,
      type: assignedBoy ? "order_assigned" : "order",
    });

    if (assignedBoy) {
      await createNotification({
        userId: assignedBoy._id,
        title: "New order assigned to you",
        message: `${createdOrder.studentName} placed an order for ${createdOrder.floor}, room ${createdOrder.roomNumber}.`,
        type: "order_assigned",
      });
    }
    await assignPendingOrders();

    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    next(error);
  }
}

export async function myOrders(req, res, next) {
  try {
    const orders = await Order.find({ studentId: req.user._id }).sort("-createdAt");
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
}

export async function listOrders(req, res, next) {
  try {
    let filter = {};
    if (req.user.role === "student") filter = { studentId: req.user._id };
    if (req.user.role === "delivery") {
      filter = {
        assignedDeliveryBoyId: req.user._id,
      };
    }
    const orders = await Order.find(filter).sort("-createdAt");
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    const canSee =
      req.user.role === "admin" ||
      order.studentId.toString() === req.user._id.toString() ||
      order.assignedDeliveryBoyId?.toString() === req.user._id.toString();
    if (!canSee) {
      res.status(403);
      throw new Error("Not allowed to view this order");
    }
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

export async function cancelOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    if (req.user.role === "student" && order.studentId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You can only cancel your own orders");
    }
    if (req.user.role === "student" && !["pending", "assigned"].includes(order.status)) {
      res.status(400);
      throw new Error("Student can cancel only pending or assigned orders");
    }
    await refundOrder(order);
    await assignPendingOrders();
    res.json({ success: true, message: "Order cancelled and refunded", order });
  } catch (error) {
    next(error);
  }
}

export async function refundOrder(order) {
  if (order.status === "cancelled") return order;
  const student = await User.findById(order.studentId);
  if (order.paymentStatus === "paid") {
    student.walletBalance += order.totalAmount;
    await student.save();
    await WalletTransaction.create({
      userId: student._id,
      orderId: order.orderId,
      type: "refund",
      amount: order.totalAmount,
      balanceAfter: student.walletBalance,
      description: `Refund for cancelled order ${order.orderId}`,
    });
  }
  order.status = "cancelled";
  order.paymentStatus = "refunded";
  order.cancelledAt = new Date();
  await order.save();
  await createNotification({
    userId: student._id,
    title: "Order cancelled",
    message: `Order ${order.orderId} was cancelled and refunded.`,
    type: "wallet",
  });
  return order;
}

export async function studentSuccess(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.studentId.toString() !== req.user._id.toString()) {
      res.status(404);
      throw new Error("Order not found");
    }
    order.studentSuccess = true;
    if (order.deliveryBoySuccess) {
      order.status = "delivered";
      order.deliveredAt = new Date();
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
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
}
