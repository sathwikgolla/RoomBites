import api from "./axios";

export const foodApi = {
  getFoods: (params = {}) => api.get("/foods", { params }).then((res) => res.data),
  getFoodsByCategory: (categorySlug) => api.get(`/foods/category/${categorySlug}`).then((res) => res.data),
  getFood: (id) => api.get(`/foods/${id}`).then((res) => res.data),
};
