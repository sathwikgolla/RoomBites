import api from "./axios";

export const getMyDeliveryOrders = () => api.get("/delivery/my-orders").then((res) => res.data);
export const getCompletedDeliveryOrders = () => api.get("/delivery/completed-orders").then((res) => res.data);
export const markDeliverySuccess = (orderId) => api.put(`/delivery/orders/${orderId}/success`).then((res) => res.data);

export const deliveryApi = {
  getAvailableOrders: () => api.get("/delivery/available-orders").then((res) => res.data),
  acceptOrder: (id) => api.put(`/delivery/orders/${id}/accept`).then((res) => res.data),
  outForDelivery: (id) => api.put(`/delivery/orders/${id}/out-for-delivery`).then((res) => res.data),
  nearClass: (id) => api.put(`/delivery/orders/${id}/near-class`).then((res) => res.data),
  success: markDeliverySuccess,
  getMyOrders: getMyDeliveryOrders,
  getCompletedOrders: getCompletedDeliveryOrders,
  getEarnings: () => api.get("/delivery/earnings").then((res) => res.data),
  updateStatus: (availabilityStatus) => api.put("/delivery/status", { availabilityStatus }).then((res) => res.data),
};
