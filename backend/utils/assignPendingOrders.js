import Order from "../models/Order.js";
import { assignDeliveryBoy } from "./assignDeliveryBoy.js";
import { createNotification } from "./createNotification.js";

export async function assignPendingOrders() {
  const pendingOrders = await Order.find({
    status: "pending",
    assignedDeliveryBoyId: null,
  }).sort({ createdAt: 1 });

  const assignedOrders = [];

  for (const order of pendingOrders) {
    const deliveryBoy = await assignDeliveryBoy(order);
    if (!deliveryBoy) break;

    order.status = "assigned";
    order.assignedDeliveryBoyId = deliveryBoy._id;
    order.assignedDeliveryBoyName = deliveryBoy.fullName;
    await order.save();

    await createNotification({
      userId: order.studentId,
      title: "Order assigned",
      message: `Your order ${order.orderId} has been assigned to ${deliveryBoy.fullName}.`,
      type: "order",
    });

    await createNotification({
      userId: deliveryBoy._id,
      title: "New order assigned to you",
      message: `${order.studentName} placed an order for ${order.floor}, room ${order.roomNumber}.`,
      type: "order",
    });

    assignedOrders.push(order);
  }

  return assignedOrders;
}
