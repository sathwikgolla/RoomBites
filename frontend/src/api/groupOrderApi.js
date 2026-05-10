import api from "./axios";

export const groupOrderApi = {
  createGroupOrder: () => api.post("/group-orders").then((res) => res.data),
  joinGroupOrder: (groupCode) => api.post("/group-orders/join", { groupCode }).then((res) => res.data),
  getGroupOrder: (code) => api.get(`/group-orders/${code}`).then((res) => res.data),
  addGroupItem: (code, payload) => api.post(`/group-orders/${code}/items`, payload).then((res) => res.data),
};
