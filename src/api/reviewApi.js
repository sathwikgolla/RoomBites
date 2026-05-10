import api from "./axios";

export const reviewApi = {
  createReview: (payload) => api.post("/reviews", payload).then((res) => res.data),
  getMyReviews: () => api.get("/reviews/my-reviews").then((res) => res.data),
};
