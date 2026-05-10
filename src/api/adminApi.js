import api from "./axios";

export const adminApi = {
  getDashboard: () => api.get("/admin/dashboard").then((res) => res.data),
  getUsers: (params = {}) => api.get("/admin/users", { params }).then((res) => res.data),
  getOrders: (params = {}) => api.get("/admin/orders", { params }).then((res) => res.data),
  cancelOrder: (id) => api.put(`/admin/orders/${id}/cancel`).then((res) => res.data),
  markDelivered: (id) => api.put(`/admin/orders/${id}/mark-delivered`).then((res) => res.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`).then((res) => res.data),
};
