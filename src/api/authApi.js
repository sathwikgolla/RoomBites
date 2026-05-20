import api from "./axios";

export const registerUser = (payload) => api.post("/auth/register", payload).then((res) => res.data);

export const authApi = {
  register: registerUser,
  login: (payload) => api.post("/auth/login", payload).then((res) => res.data),
  me: () => api.get("/auth/me").then((res) => res.data),
  updateProfile: (payload) => api.put("/auth/profile", payload).then((res) => res.data),
  changePassword: (payload) => api.put("/auth/change-password", payload).then((res) => res.data),
  cancelAccount: () => api.put("/auth/cancel-account").then((res) => res.data),
};
