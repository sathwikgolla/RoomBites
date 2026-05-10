import Order from "../models/Order.js";
import User from "../models/User.js";

export const activeDeliveryStatuses = ["assigned", "accepted", "out_for_delivery", "near_class", "waiting_confirmation"];

function roomDistance(a, b) {
  const first = Number(String(a || "").replace(/\D/g, ""));
  const second = Number(String(b || "").replace(/\D/g, ""));
  if (!Number.isFinite(first) || !Number.isFinite(second)) return Infinity;
  return Math.abs(first - second);
}

async function findGroupedDeliveryBoy(orderDetails) {
  if (!orderDetails?.floor || !orderDetails?.roomNumber) return null;

  const activeOrders = await Order.find({
    status: { $in: ["assigned", "accepted", "out_for_delivery", "near_class"] },
    assignedDeliveryBoyId: { $ne: null },
    floor: orderDetails.floor,
    department: orderDetails.department,
  })
    .sort({ createdAt: 1 })
    .populate("assignedDeliveryBoyId", "fullName email availabilityStatus accountStatus emailVerified isCancelled role");

  const grouped = activeOrders.find((order) => {
    const deliveryBoy = order.assignedDeliveryBoyId;
    return (
      deliveryBoy &&
      deliveryBoy.role === "delivery" &&
      (deliveryBoy.availabilityStatus || "available") === "available" &&
      deliveryBoy.accountStatus === "active" &&
      deliveryBoy.emailVerified === true &&
      deliveryBoy.isCancelled !== true &&
      roomDistance(order.roomNumber, orderDetails.roomNumber) <= 3
    );
  });

  return grouped?.assignedDeliveryBoyId || null;
}

export async function assignDeliveryBoy(orderDetails = null) {
  console.log("Finding available delivery boys...");
  const groupedDeliveryBoy = await findGroupedDeliveryBoy(orderDetails);
  if (groupedDeliveryBoy) {
    console.log("Grouped delivery boy selected:", groupedDeliveryBoy.email);
    return groupedDeliveryBoy;
  }

  const deliveryBoys = await User.find({
    role: "delivery",
    $or: [{ availabilityStatus: "available" }, { availabilityStatus: { $exists: false } }, { availabilityStatus: null }],
    accountStatus: "active",
    emailVerified: true,
    isCancelled: { $ne: true },
  }).sort({ deliveryId: 1, createdAt: 1 });

  console.log("Delivery boys found:", deliveryBoys.length);
  deliveryBoys.forEach((boy) => {
    console.log(boy.email, boy.role, boy.availabilityStatus, boy.accountStatus, boy.emailVerified);
  });

  if (!deliveryBoys.length) {
    console.log("No available delivery boy found. Order remains pending.");
    return null;
  }

  const deliveryLoads = await Promise.all(
    deliveryBoys.map(async (deliveryBoy) => {
      const activeOrderCount = await Order.countDocuments({
        assignedDeliveryBoyId: deliveryBoy._id,
        status: { $in: activeDeliveryStatuses },
      });
      return { deliveryBoy, activeOrderCount };
    })
  );

  const freeDeliveryLoads = deliveryLoads.filter((entry) => entry.activeOrderCount === 0);
  if (!freeDeliveryLoads.length) {
    console.log("No free delivery boy found. Order remains pending.");
    return null;
  }

  freeDeliveryLoads.sort((a, b) => {
    if (a.activeOrderCount !== b.activeOrderCount) return a.activeOrderCount - b.activeOrderCount;
    return String(a.deliveryBoy.deliveryId || "").localeCompare(String(b.deliveryBoy.deliveryId || ""));
  });

  return freeDeliveryLoads[0].deliveryBoy;
}
