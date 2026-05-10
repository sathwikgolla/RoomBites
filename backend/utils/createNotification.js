import Notification from "../models/Notification.js";

export async function createNotification({ userId, title, message, type = "system" }) {
  return Notification.create({ userId, title, message, type });
}

export async function notifyMany(users, payload) {
  if (!users.length) return [];
  return Notification.insertMany(
    users.map((user) => ({
      userId: user._id,
      title: payload.title,
      message: payload.message,
      type: payload.type || "system",
    }))
  );
}
