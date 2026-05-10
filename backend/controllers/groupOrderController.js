import FoodItem from "../models/FoodItem.js";
import GroupOrder from "../models/GroupOrder.js";

function groupCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function createGroupOrder(req, res, next) {
  try {
    let code = groupCode();
    while (await GroupOrder.exists({ groupCode: code })) code = groupCode();
    const group = await GroupOrder.create({
      groupCode: code,
      ownerId: req.user._id,
      participants: [req.user._id],
      items: [],
    });
    res.status(201).json({ success: true, group });
  } catch (error) {
    next(error);
  }
}

export async function joinGroupOrder(req, res, next) {
  try {
    const group = await GroupOrder.findOne({ groupCode: String(req.body.groupCode).toUpperCase(), finalOrderStatus: "open" });
    if (!group) {
      res.status(404);
      throw new Error("Group order not found");
    }
    if (!group.participants.some((id) => id.toString() === req.user._id.toString())) {
      group.participants.push(req.user._id);
      await group.save();
    }
    res.json({ success: true, group });
  } catch (error) {
    next(error);
  }
}

export async function addGroupItem(req, res, next) {
  try {
    const group = await GroupOrder.findOne({ groupCode: String(req.params.code).toUpperCase(), finalOrderStatus: "open" });
    if (!group) {
      res.status(404);
      throw new Error("Group order not found");
    }
    if (!group.participants.some((id) => id.toString() === req.user._id.toString())) {
      res.status(403);
      throw new Error("Join the group before adding items");
    }
    const food = await FoodItem.findById(req.body.foodItemId);
    if (!food) {
      res.status(404);
      throw new Error("Food item not found");
    }
    const quantity = Number(req.body.quantity || 1);
    group.items.push({
      studentId: req.user._id,
      foodItemId: food._id,
      name: food.name,
      image: food.image,
      price: food.price,
      quantity,
      total: food.price * quantity,
    });
    await group.save();
    res.json({ success: true, group });
  } catch (error) {
    next(error);
  }
}

export async function getGroupOrder(req, res, next) {
  try {
    const group = await GroupOrder.findOne({ groupCode: String(req.params.code).toUpperCase() })
      .populate("participants", "fullName email")
      .populate("ownerId", "fullName email");
    if (!group) {
      res.status(404);
      throw new Error("Group order not found");
    }
    res.json({ success: true, group });
  } catch (error) {
    next(error);
  }
}
