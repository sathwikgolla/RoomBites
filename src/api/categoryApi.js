import api from "./axios";

export const categoryApi = {
  getCategories: () => api.get("/categories").then((res) => res.data),
  getCategory: (slug) => api.get(`/categories/${slug}`).then((res) => res.data),
};
