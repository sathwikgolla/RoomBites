import api from "./axios";

export const notificationApi = {
  getNotifications: () => api.get("/notifications").then((res) => res.data),
  markRead: (id) => api.put(`/notifications/${id}/read`).then((res) => res.data),
  markAllRead: () => api.put("/notifications/read-all").then((res) => res.data),
  deleteNotification: (id) => api.delete(`/notifications/${id}`).then((res) => res.data),
};
