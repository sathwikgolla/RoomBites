import { categories, foodItems } from "../data/foodData";
import { seedUsers } from "../data/seedData";

const FOOD_DATA_VERSION = "dish-matched-bing-images-v1";

const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
};

export const storage = {
  read,
  write,
  init() {
    if (!localStorage.getItem("users")) write("users", seedUsers);
    if (localStorage.getItem("foodDataVersion") !== FOOD_DATA_VERSION) {
      write("foodCategories", categories);
      write("foodItems", foodItems);
      localStorage.setItem("foodDataVersion", FOOD_DATA_VERSION);
    } else {
      if (!localStorage.getItem("foodCategories")) write("foodCategories", categories);
      if (!localStorage.getItem("foodItems")) write("foodItems", foodItems);
    }
    if (!localStorage.getItem("cartItems")) write("cartItems", []);
    if (!localStorage.getItem("orders")) write("orders", []);
    if (!localStorage.getItem("notifications")) write("notifications", []);
  },
  id(prefix) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
  },
  money(value) {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value || 0);
  },
};
