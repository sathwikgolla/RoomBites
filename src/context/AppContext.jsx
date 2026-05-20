import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { apiError } from "../api/axios";
import { adminApi } from "../api/adminApi";
import { categoryApi } from "../api/categoryApi";
import { couponApi } from "../api/couponApi";
import { deliveryApi } from "../api/deliveryApi";
import { foodApi } from "../api/foodApi";
import { groupOrderApi } from "../api/groupOrderApi";
import { notificationApi } from "../api/notificationApi";
import { orderApi } from "../api/orderApi";
import { reviewApi } from "../api/reviewApi";
import { walletApi } from "../api/walletApi";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";

const AppContext = createContext(null);
const deliveryCharge = 15;

const money = (amount = 0) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const statusText = {
  pending: "Waiting for available delivery boy",
  assigned: "Assigned to delivery boy",
  accepted: "Accepted by delivery boy",
  out_for_delivery: "Out for Delivery",
  near_class: "Near Your Class",
  waiting_confirmation: "Waiting for Confirmation",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusApi = {
  "Waiting for available delivery boy": "pending",
  "Assigned to delivery boy": "assigned",
  "Accepted by delivery boy": "accepted",
  "Out for Delivery": "out_for_delivery",
  "Near Your Class": "near_class",
  "Waiting for confirmation": "waiting_confirmation",
  Delivered: "delivered",
  Cancelled: "cancelled",
};

const normalizeOrder = (order) => ({
  ...order,
  id: order._id || order.id,
  status: statusText[order.status] || order.status,
  rawStatus: statusApi[order.status] || order.status,
  items: order.items || [],
});

const normalizeNotification = (notification) => ({
  ...notification,
  id: notification._id || notification.id,
  read: notification.isRead ?? notification.read,
});

const isMongoId = (value) => typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

export function AppProvider({ children }) {
  const auth = useAuth();
  const cart = useCart();
  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [studentOrders, setStudentOrders] = useState([]);
  const [deliveryActiveOrders, setDeliveryActiveOrders] = useState([]);
  const [completedDeliveryOrders, setCompletedDeliveryOrders] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [deliveryEarnings, setDeliveryEarnings] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
    window.clearTimeout(window.__roomBitesToast);
    window.__roomBitesToast = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const hasSession = useCallback(() => Boolean(localStorage.getItem("token") && auth.currentUser), [auth.currentUser]);

  const fetchCategories = useCallback(async () => {
    const data = await categoryApi.getCategories();
    setCategories(data.categories || []);
    return data.categories || [];
  }, []);

  const fetchFoodsByCategory = useCallback(async (categorySlug) => {
    const data = await foodApi.getFoodsByCategory(categorySlug);
    setFoodItems(data.foods || []);
    return data;
  }, []);

  const fetchStudentOrders = useCallback(async () => {
    if (!hasSession()) return [];
    const data = await orderApi.getMyOrders();
    const next = (data.orders || []).map(normalizeOrder);
    setOrders(next);
    setStudentOrders(next);
    return next;
  }, [hasSession]);

  const fetchDeliveryOrders = useCallback(async () => {
    if (!hasSession()) return [];
    const assigned = await deliveryApi.getMyOrders();
    const next = (assigned.orders || []).map(normalizeOrder);
    setDeliveryActiveOrders(next);
    return next;
  }, [hasSession]);

  const fetchCompletedDeliveryOrders = useCallback(async () => {
    if (!hasSession()) return [];
    const completed = await deliveryApi.getCompletedOrders();
    const next = (completed.orders || []).map(normalizeOrder);
    setCompletedDeliveryOrders(next);
    return next;
  }, [hasSession]);

  const fetchAdminData = useCallback(async () => {
    if (!hasSession()) return { stats: {}, users: [], orders: [] };
    const [stats, userData, orderData] = await Promise.all([adminApi.getDashboard(), adminApi.getUsers(), adminApi.getOrders()]);
    setDashboardStats(stats.stats || {});
    setAnalytics(stats.analytics || {});
    setUsers((userData.users || []).map((user) => ({ ...user, id: user._id || user.id, name: user.fullName || user.name })));
    const nextOrders = (orderData.orders || []).map(normalizeOrder);
    setOrders(nextOrders);
    setAdminOrders(nextOrders);
    return { stats: stats.stats || {}, users: userData.users || [], orders: orderData.orders || [] };
  }, [hasSession]);

  const fetchNotifications = useCallback(async () => {
    if (!hasSession()) return [];
    const data = await notificationApi.getNotifications();
    const next = (data.notifications || []).map(normalizeNotification);
    setNotifications(next);
    return next;
  }, [hasSession]);

  const refreshWallet = useCallback(async () => {
    if (!hasSession()) return null;
    const data = await walletApi.getBalance();
    const user = { ...auth.currentUser, walletBalance: data.walletBalance };
    localStorage.setItem("currentUser", JSON.stringify(user));
    await auth.refreshUser();
    return data.walletBalance;
  }, [auth, hasSession]);

  const login = async (role, email, password) => {
    const result = await auth.login(role, email, password);
    if (result.ok) showToast(`Welcome back, ${result.user.name}`);
    return result;
  };

  const register = async (payload) => {
    const result = await auth.register(payload);
    if (result.ok) showToast("Account created successfully");
    return result;
  };

  const logout = () => {
    auth.logout();
    setOrders([]);
    setNotifications([]);
    setUsers([]);
  };

  const updateProfile = async (payload) => {
    const result = await auth.updateProfile(payload);
    showToast(result.ok ? "Profile updated" : result.message, result.ok ? "success" : "error");
    return result;
  };

  const cancelAccount = async () => {
    const result = await auth.cancelAccount();
    showToast(result.ok ? "Account cancelled successfully" : result.message, result.ok ? "success" : "error");
    return result;
  };

  const addToCart = (item, quantity = 1) => {
    try {
      cart.addToCart(item, quantity);
      showToast("Item added to cart");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const placeOrder = async (details, speedOption) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !auth.currentUser) return { ok: false, message: "Please login before placing an order", redirectToLogin: true };
      const invalidCartItem = cart.cartItems.find((item) => !isMongoId(item.foodItemId));
      if (invalidCartItem) {
        cart.clearCart();
        return { ok: false, message: "Old cart data was cleared. Please add food from the menu again." };
      }
      const payload = {
        items: cart.cartItems.map((item) => ({ foodItemId: item.foodItemId, quantity: item.quantity })),
        floor: details.floor,
        roomNumber: details.roomNumber,
        department: details.department,
        phone: details.phone,
        deliveryNote: details.deliveryNote,
        couponCode: details.couponCode,
        speedOption: (speedOption.id || speedOption.value || speedOption.speedOption || "20min").replace("-min", "min"),
      };
      console.log("CART ITEMS:", cart.cartItems);
      console.log("TOKEN:", token);
      console.log("ORDER PAYLOAD:", payload);
      const data = await orderApi.placeOrder(payload);
      cart.clearCart();
      await Promise.all([fetchStudentOrders(), auth.refreshUser(), fetchNotifications()]);
      showToast("Order placed successfully");
      return { ok: true, order: normalizeOrder(data.order) };
    } catch (error) {
      return { ok: false, message: apiError(error) };
    }
  };

  const cancelOrder = async (orderId, byAdmin = false) => {
    try {
      if (!hasSession()) return { ok: false, message: "Please login first" };
      const data = byAdmin ? await adminApi.cancelOrder(orderId) : await orderApi.cancelOrder(orderId);
      showToast("Order cancelled and refunded");
      if (auth.currentUser?.role === "admin") await fetchAdminData();
      if (auth.currentUser?.role === "student") await Promise.all([fetchStudentOrders(), auth.refreshUser(), fetchNotifications()]);
      return { ok: true, order: normalizeOrder(data.order) };
    } catch (error) {
      showToast(apiError(error), "error");
      return { ok: false, message: apiError(error) };
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      if (!hasSession()) return;
      await deliveryApi.acceptOrder(orderId);
      showToast("Order accepted");
      await fetchDeliveryOrders();
    } catch (error) {
      showToast(apiError(error), "error");
    }
  };

  const markOutForDelivery = async (orderId) => {
    try {
      if (!hasSession()) return;
      await deliveryApi.outForDelivery(orderId);
      showToast("Marked out for delivery");
      await fetchDeliveryOrders();
    } catch (error) {
      showToast(apiError(error), "error");
    }
  };

  const markNearClass = async (orderId) => {
    try {
      if (!hasSession()) return;
      await deliveryApi.nearClass(orderId);
      showToast("Marked near classroom");
      await Promise.all([fetchDeliveryOrders(), fetchNotifications()]);
    } catch (error) {
      showToast(apiError(error), "error");
    }
  };

  const fetchDeliveryEarnings = useCallback(async () => {
    if (!hasSession()) return null;
    const data = await deliveryApi.getEarnings();
    setDeliveryEarnings(data.earnings || null);
    return data.earnings || null;
  }, [hasSession]);

  const updateDeliveryStatus = async (availabilityStatus) => {
    try {
      if (!hasSession()) return { ok: false, message: "Please login first" };
      const data = await deliveryApi.updateStatus(availabilityStatus);
      await Promise.all([auth.refreshUser(), fetchDeliveryOrders(), fetchNotifications()]);
      showToast(data.message || "Availability updated");
      return { ok: true, user: data.user, availabilityStatus: data.availabilityStatus };
    } catch (error) {
      showToast(apiError(error), "error");
      return { ok: false, message: apiError(error) };
    }
  };

  const confirmDelivery = async (orderId, actor) => {
    try {
      if (!hasSession()) return;
      if (actor === "student") {
        await orderApi.studentSuccess(orderId);
        await Promise.all([fetchStudentOrders(), fetchNotifications()]);
      } else {
        await deliveryApi.success(orderId);
        await Promise.all([fetchDeliveryOrders(), fetchCompletedDeliveryOrders()]);
      }
      showToast("Success confirmation saved");
    } catch (error) {
      showToast(apiError(error), "error");
    }
  };

  const submitReview = async (payload) => {
    try {
      if (!hasSession()) return { ok: false, message: "Please login first" };
      const data = await reviewApi.createReview(payload);
      await Promise.all([fetchStudentOrders(), fetchNotifications()]);
      showToast("Thanks for rating your order");
      return { ok: true, review: data.review };
    } catch (error) {
      showToast(apiError(error), "error");
      return { ok: false, message: apiError(error) };
    }
  };

  const applyCoupon = async (code) => {
    try {
      const data = await couponApi.validateCoupon(code);
      showToast(`${data.coupon.code} coupon applied`);
      return { ok: true, coupon: data.coupon };
    } catch (error) {
      showToast(apiError(error), "error");
      return { ok: false, message: apiError(error) };
    }
  };

  const createGroupOrder = async () => {
    try {
      const data = await groupOrderApi.createGroupOrder();
      showToast(`Group order created: ${data.group.groupCode}`);
      return { ok: true, group: data.group };
    } catch (error) {
      showToast(apiError(error), "error");
      return { ok: false, message: apiError(error) };
    }
  };

  const joinGroupOrder = async (groupCode) => {
    try {
      const data = await groupOrderApi.joinGroupOrder(groupCode);
      showToast(`Joined group ${data.group.groupCode}`);
      return { ok: true, group: data.group };
    } catch (error) {
      showToast(apiError(error), "error");
      return { ok: false, message: apiError(error) };
    }
  };

  const deleteUser = async (userId) => {
    try {
      if (!hasSession()) return;
      await adminApi.deleteUser(userId);
      showToast("User cancelled");
      await fetchAdminData();
    } catch (error) {
      showToast(apiError(error), "error");
    }
  };

  const markResolved = async (orderId) => {
    try {
      if (!hasSession()) return;
      await adminApi.markDelivered(orderId);
      showToast("Order marked delivered");
      await fetchAdminData();
    } catch (error) {
      showToast(apiError(error), "error");
    }
  };

  const markNotificationRead = async (id) => {
    if (!hasSession()) return;
    await notificationApi.markRead(id);
    await fetchNotifications();
  };

  const markAllNotificationsRead = async () => {
    if (!hasSession()) return;
    await notificationApi.markAllRead();
    await fetchNotifications();
  };

  const value = useMemo(
    () => ({
      users,
      currentUser: auth.currentUser,
      token: auth.token,
      isAuthenticated: auth.isAuthenticated,
      loading: auth.loading,
      categories,
      foodItems,
      cartItems: cart.cartItems,
      orders,
      studentOrders,
      deliveryActiveOrders,
      completedDeliveryOrders,
      adminOrders,
      notifications,
      dashboardStats,
      analytics,
      deliveryEarnings,
      toast,
      deliveryCharge,
      cartSubtotal: cart.cartSubtotal,
      cartCount: cart.cartCount,
      money,
      login,
      register,
      logout,
      refreshUser: auth.refreshUser,
      updateProfile,
      cancelAccount,
      fetchCategories,
      fetchFoodsByCategory,
      fetchStudentOrders,
      fetchDeliveryOrders,
      fetchCompletedDeliveryOrders,
      fetchDeliveryEarnings,
      fetchAdminData,
      fetchNotifications,
      refreshWallet,
      addToCart,
      changeCartQty: cart.changeCartQty,
      removeCartItem: cart.removeCartItem,
      clearCart: cart.clearCart,
      placeOrder,
      cancelOrder,
      acceptOrder,
      markOutForDelivery,
      markNearClass,
      updateDeliveryStatus,
      confirmDelivery,
      submitReview,
      applyCoupon,
      createGroupOrder,
      joinGroupOrder,
      deleteUser,
      markResolved,
      markNotificationRead,
      markAllNotificationsRead,
      showToast,
      setNotifications,
    }),
    [adminOrders, analytics, auth, cart, categories, completedDeliveryOrders, dashboardStats, deliveryActiveOrders, deliveryEarnings, fetchAdminData, fetchCategories, fetchCompletedDeliveryOrders, fetchDeliveryEarnings, fetchDeliveryOrders, fetchFoodsByCategory, fetchNotifications, fetchStudentOrders, foodItems, notifications, orders, studentOrders, toast, users]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
