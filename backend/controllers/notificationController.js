import Notification from "../models/Notification.js";

export async function getNotifications(req, res, next) {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort("-createdAt");
    res.json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
}

export async function markRead(req, res, next) {
  try {
    const notification = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, { isRead: true }, { new: true });
    res.json({ success: true, notification });
  } catch (error) {
    next(error);
  }
}

export async function markAllRead(req, res, next) {
  try {
    await Notification.updateMany({ userId: req.user._id }, { isRead: true });
    res.json({ success: true, message: "All notifications marked read" });
  } catch (error) {
    next(error);
  }
}

export async function deleteNotification(req, res, next) {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    next(error);
  }
}
