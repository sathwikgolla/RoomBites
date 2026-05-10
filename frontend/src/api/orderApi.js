import api from "./axios";

export const placeOrder = async (orderData) => {
  const res = await api.post("/orders", orderData);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get("/orders/my-orders");
  return res.data;
};

export const getOrder = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

export const cancelOrder = async (id) => {
  const res = await api.put(`/orders/${id}/cancel`);
  return res.data;
};

export const studentSuccess = async (id) => {
  const res = await api.put(`/orders/${id}/student-success`);
  return res.data;
};

export const orderApi = {
  placeOrder,
  getMyOrders,
  getOrder,
  cancelOrder,
  studentSuccess,
};
