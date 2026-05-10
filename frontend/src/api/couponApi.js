import api from "./axios";

export const couponApi = {
  listCoupons: () => api.get("/coupons").then((res) => res.data),
  validateCoupon: (code) => api.get(`/coupons/${code}`).then((res) => res.data),
};
