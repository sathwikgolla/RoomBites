import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.warn("VITE_API_URL is not set. Add it to .env for local and production builds.");
}

const api = axios.create({
  baseURL: API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.friendlyMessage = "Backend server not reachable. Please check the deployed API URL.";
    }
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      window.dispatchEvent(new CustomEvent("roombites:unauthorized"));
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export function apiError(error) {
  return error?.response?.data?.message || error?.friendlyMessage || error?.message || "Something went wrong";
}

export default api;
