import api from "./axios";

export const walletApi = {
  getBalance: () => api.get("/wallet/balance").then((res) => res.data),
  getTransactions: () => api.get("/wallet/transactions").then((res) => res.data),
};
