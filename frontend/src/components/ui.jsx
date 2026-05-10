import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Check,
  ChevronDown,
  Clock,
  CreditCard,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShoppingCart,
  Star,
  Trash2,
  User,
  Utensils,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { getImageUrl, handleImageError } from "../utils/getImageUrl";

export function GlassCard({ children, className = "" }) {
  return <div className={`glass rounded-2xl ${className}`}>{children}</div>;
}

export function GradientButton({ children, className = "", variant = "primary", ...props }) {
  const styles =
    variant === "ghost"
      ? "light-btn hover:-translate-y-0.5"
      : "primary-btn shadow-lg shadow-[#5C3A21]/20 hover:-translate-y-0.5";
  return (
    <button className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold transition ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function StatusBadge({ status }) {
  const map = {
    Pending: "bg-orange-100 text-orange-700",
    "Waiting for available delivery boy": "bg-orange-100 text-orange-700",
    "Assigned to delivery boy": "bg-yellow-100 text-yellow-800",
    "Accepted by Delivery Boy": "bg-amber-100 text-amber-800",
    "Accepted by delivery boy": "bg-amber-100 text-amber-800",
    "Out for Delivery": "bg-blue-100 text-blue-700",
    "Near Your Class": "bg-orange-100 text-orange-700",
    "Waiting for student confirmation": "bg-purple-100 text-purple-700",
    "Waiting for delivery boy confirmation": "bg-purple-100 text-purple-700",
    "Waiting for confirmation": "bg-purple-100 text-purple-700",
    "Waiting for Confirmation": "bg-purple-100 text-purple-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${map[status] || "bg-stone-100 text-stone-700"}`}>{status}</span>;
}

export function Toast() {
  const { toast } = useApp();
  return (
    <AnimatePresence>
      {toast && (
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
          <div className={`rounded-2xl px-5 py-3 font-semibold text-white shadow-premium ${toast.type === "error" ? "bg-danger" : "bg-coffee"}`}>
            {toast.message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function NotificationDropdown() {
  const { notifications, currentUser, token, fetchNotifications, markAllNotificationsRead } = useApp();
  const [open, setOpen] = useState(false);
  const scoped = notifications.slice(0, 8);
  const unread = scoped.filter((n) => !n.read).length;
  useEffect(() => {
    if (!token || !currentUser) return;
    fetchNotifications().catch(() => {});
    const interval = setInterval(() => {
      fetchNotifications().catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [currentUser, fetchNotifications, token]);
  const markRead = async () => {
    await markAllNotificationsRead();
    setOpen(false);
  };
  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && token && currentUser) await fetchNotifications();
  };
  return (
    <div className="relative">
      <button onClick={toggle} className="relative rounded-xl bg-[#FEF3C7] p-3 text-coffee transition hover:bg-[#FDE68A]" title="Notifications">
        <Bell size={20} />
        {unread > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-danger px-1.5 text-[10px] font-bold text-white">{unread}</span>}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl bg-[#FFFDF8] shadow-premium">
            <div className="flex items-center justify-between border-b border-orange-100 p-4">
              <b>Notifications</b>
              <button className="text-sm font-semibold text-caramel" onClick={markRead}>Mark read</button>
            </div>
            <div className="max-h-80 overflow-auto">
              {scoped.length ? scoped.map((n) => (
                <div key={n.id} className="border-b border-orange-50 p-4">
                  <p className="font-semibold text-coffee">{n.title}</p>
                  <p className="text-sm text-muted">{n.message}</p>
                </div>
              )) : <EmptyState title="No notifications" compact />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProfileDropdown() {
  const { currentUser, logout, money } = useApp();
  const [open, setOpen] = useState(false);
  if (!currentUser) return null;
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-xl bg-[#FEF3C7] px-3 py-2 text-sm font-bold text-coffee transition hover:bg-[#FDE68A]">
        <User size={18} /> <span className="hidden sm:inline">{currentUser.name}</span> <ChevronDown size={16} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 mt-3 w-64 rounded-2xl bg-[#FFFDF8] p-3 shadow-premium">
            <div className="rounded-xl bg-cream p-3">
              <p className="font-bold text-coffee">{currentUser.name}</p>
              <p className="text-sm text-muted">{currentUser.role}</p>
              <p className="mt-2 text-sm font-bold text-caramel">{money(currentUser.walletBalance)}</p>
            </div>
            <Link className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 font-bold text-coffee hover:bg-cream" to="/profile" onClick={() => setOpen(false)}><User size={17} /> Profile</Link>
            {currentUser.role === "student" && <Link className="flex items-center gap-2 rounded-xl px-3 py-2 font-bold text-coffee hover:bg-cream" to="/checkout" onClick={() => setOpen(false)}><CreditCard size={17} /> Checkout</Link>}
            <Link className="flex items-center gap-2 rounded-xl px-3 py-2 font-bold text-coffee hover:bg-cream" to="/notifications" onClick={() => setOpen(false)}><Bell size={17} /> Notifications</Link>
            <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-danger hover:bg-red-50" onClick={logout}><LogOut size={17} /> Logout</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const { currentUser, cartCount, money, logout } = useApp();
  const [open, setOpen] = useState(false);
  const publicLinks = [["Home", "/"], ["About", "/about"], ["Menu", "/menu"], ["Login", "/login"], ["Register", "/register"]];
  const studentLinks = [["Home", "/"], ["Menu", "/menu"], ["Dashboard", "/dashboard"], ["Checkout", "/checkout"], ["Orders", "/orders"], ["Notifications", "/notifications"], ["Profile", "/profile"]];
  const deliveryLinks = [["Delivery Dashboard", "/delivery-dashboard"], ["Assigned Orders", "/assigned-orders"], ["Notifications", "/notifications"], ["Profile", "/profile"]];
  const adminLinks = [["Admin Dashboard", "/admin-dashboard"], ["Users", "/admin/users"], ["Orders", "/admin/orders"], ["Reports", "/admin/reports"], ["Notifications", "/notifications"], ["Profile", "/profile"]];
  const links = !currentUser ? publicLinks : currentUser.role === "student" ? studentLinks : currentUser.role === "delivery" ? deliveryLinks : adminLinks;
  const showCart = !currentUser || currentUser.role === "student";
  return (
    <header className="sticky top-0 z-40 px-3 py-3">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-black text-coffee">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-coffee to-orangeWarm text-white"><Utensils size={20} /></span>
          RoomBites
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {links.map(([label, to]) => <NavLink key={to} className={({ isActive }) => `rounded-xl px-3 py-2 text-sm font-bold transition ${isActive ? "bg-[#FEF3C7] text-[#5C3A21] ring-1 ring-[#A16207]/30" : "text-black hover:bg-[#FEF3C7]/70 hover:text-[#A16207]"}`} to={to}>{label}</NavLink>)}
          {currentUser && <button className="rounded-xl px-3 py-2 text-sm font-bold text-danger hover:bg-red-50" onClick={logout}>Logout</button>}
        </div>
        <div className="flex items-center gap-2">
          {currentUser && <span className="hidden rounded-xl bg-beige px-3 py-2 text-sm font-black text-black md:inline-flex"><Wallet size={16} className="mr-1 text-coffee" /> {money(currentUser.walletBalance)}</span>}
          {showCart && <Link to="/cart" className="relative rounded-xl bg-[#FEF3C7] p-3 text-coffee transition hover:bg-[#FDE68A]" title="Cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-orangeWarm px-1.5 text-[10px] font-bold text-white">{cartCount}</span>}
          </Link>}
          {currentUser && <NotificationDropdown />}
          {currentUser && <ProfileDropdown />}
          <button className="rounded-xl bg-coffee p-3 text-white lg:hidden" onClick={() => setOpen(!open)}><Menu size={20} /></button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="glass mx-auto mt-2 grid max-w-7xl gap-1 rounded-2xl p-3 lg:hidden">
            {links.map(([label, to]) => (
              <NavLink key={to} onClick={() => setOpen(false)} className={({ isActive }) => `rounded-xl px-3 py-3 font-bold ${isActive ? "bg-[#FEF3C7] text-[#5C3A21]" : "text-black hover:bg-[#FEF3C7]/70 hover:text-[#A16207]"}`} to={to}>{label}</NavLink>
            ))}
            {currentUser && <button className="rounded-xl px-3 py-3 text-left font-bold text-danger hover:bg-red-50" onClick={() => { setOpen(false); logout(); }}>Logout</button>}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  return <footer className="mt-16 bg-coffee px-5 py-10 text-center text-cream">RoomBites campus delivery app. Connected to the RoomBites API with a local cart.</footer>;
}

export function ProtectedRoute() {
  const { currentUser, token, loading } = useApp();
  const location = useLocation();
  if (loading) return <LoadingSkeleton />;
  return token && currentUser ? <Outlet /> : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

export function RoleBasedRoute({ roles }) {
  const { currentUser, token, loading } = useApp();
  const location = useLocation();
  if (loading) return <LoadingSkeleton />;
  if (!token || !currentUser) return <Navigate to="/login" replace />;
  if (roles.includes(currentUser.role)) return <Outlet />;
  const fallback = currentUser.role === "delivery" ? "/delivery-dashboard" : currentUser.role === "admin" ? "/admin-dashboard" : "/dashboard";
  return <Navigate to={fallback} state={{ from: location.pathname }} replace />;
}

export function CategoryCard({ category }) {
  const slug = category.slug || category.id;
  return (
    <motion.div whileHover={{ rotateX: 4, rotateY: -5, y: -8 }} className="food-card preserve-3d overflow-hidden rounded-2xl bg-[#FFFDF8] shadow-premium border border-[#D6A85A]/40">
      <Link to={`/menu/${slug}`} className="block h-full cursor-pointer">
      <img className="food-img h-48 w-full object-cover" src={getImageUrl(category.image, category.name)} alt={category.name} onError={handleImageError} />
      <div className="p-5">
        <h3 className="text-xl font-black text-coffee">{category.name}</h3>
        <p className="mt-2 min-h-12 text-sm text-chocolate">{category.description}</p>
        <span className="mt-5 inline-flex w-full items-center justify-center rounded-xl primary-btn px-4 py-3 font-bold transition">View Items</span>
      </div>
      </Link>
    </motion.div>
  );
}

export function FoodItemCard({ item }) {
  const { addToCart, changeCartQty, cartItems } = useApp();
  const itemId = item._id || item.foodItemId;
  const cartItem = cartItems.find((entry) => entry.foodItemId === itemId || entry.id === itemId);
  const qty = cartItem?.quantity || 0;
  const handleAdd = () => {
    addToCart(item, 1);
  };
  return (
    <motion.article whileHover={{ y: -7, rotateX: 2 }} className="food-card preserve-3d overflow-hidden rounded-2xl bg-[#FFFDF8] shadow-premium border border-[#D6A85A]/40">
      <img src={getImageUrl(item.image, item.name)} alt={item.name} className="food-img h-48 w-full object-cover" onError={handleImageError} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-black text-coffee">{item.name}</h3>
          <span className="rounded-full bg-beige px-3 py-1 text-sm font-black text-caramel">₹{item.price}</span>
        </div>
        <p className="mt-2 text-sm text-chocolate">{item.description}</p>
        <div className="mt-4 flex items-center justify-between text-sm font-bold text-muted">
          <span>★ {item.rating}</span><span className="inline-flex items-center gap-1"><Clock size={15} /> {item.prepTime}</span>
        </div>
        <div className="mt-5 flex items-center gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-xl light-btn font-bold transition hover:-translate-y-0.5" onClick={() => changeCartQty(itemId, -1)}><Minus size={16} /></button>
          <span className="w-8 text-center font-black">{qty}</span>
          <button className="grid h-10 w-10 place-items-center rounded-xl secondary-btn font-bold transition hover:-translate-y-0.5" onClick={() => addToCart(item, 1)}><Plus size={16} /></button>
          <GradientButton className="ml-auto py-2.5" onClick={handleAdd}><ShoppingCart size={18} /> Add</GradientButton>
        </div>
      </div>
    </motion.article>
  );
}

export function CartItem({ item }) {
  const { changeCartQty, removeCartItem, money } = useApp();
  const itemId = item.foodItemId || item.id;
  return (
    <div className="flex gap-4 rounded-2xl bg-[#FFFDF8] p-4 shadow-sm border border-[#D6A85A]/30">
      <img src={getImageUrl(item.image, item.name)} alt={item.name} className="h-24 w-24 rounded-xl object-cover" onError={handleImageError} />
      <div className="min-w-0 flex-1">
        <h4 className="font-black text-coffee">{item.name}</h4>
        <p className="text-sm text-muted">{money(item.price)} each</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button className="rounded-lg light-btn p-2" onClick={() => changeCartQty(itemId, -1)}><Minus size={15} /></button>
          <b>{item.quantity}</b>
          <button className="rounded-lg secondary-btn p-2" onClick={() => changeCartQty(itemId, 1)}><Plus size={15} /></button>
          <button className="ml-auto rounded-lg bg-red-50 p-2 text-danger" onClick={() => removeCartItem(itemId)}><Trash2 size={16} /></button>
        </div>
      </div>
      <b className="text-coffee">{money(item.price * item.quantity)}</b>
    </div>
  );
}

export function CartDrawer() {
  return null;
}

export function SpeedDeliveryCard({ option, selected, onClick }) {
  return (
    <button onClick={onClick} className={`rounded-2xl border p-5 text-left transition ${selected ? "border-orangeWarm bg-orange-100 shadow-glass" : "border-[#D6A85A]/40 bg-[#FFFDF8] hover:-translate-y-1 hover:shadow-glass"}`}>
      <div className="flex items-center justify-between">
        <Clock className={selected ? "text-orangeWarm" : "text-caramel"} />
        {selected && <Check className="text-success" />}
      </div>
      <p className="mt-4 font-black text-black">{option.label}</p>
      <p className="text-sm font-semibold text-[#3B2416]">{option.charge ? `Extra charge: ₹${option.charge}` : "Extra charge: ₹0 Free Delivery"}</p>
    </button>
  );
}

export function WalletCard({ balance }) {
  const { money } = useApp();
  return <GlassCard className="bg-[#FEF3C7] p-6 text-black"><Wallet className="text-coffee" /><p className="mt-4 text-sm font-bold text-stone-900">Demo Wallet Balance</p><p className="wallet-text text-3xl">{money(balance)}</p></GlassCard>;
}

export function StatsCard({ icon: Icon = LayoutDashboard, label, value, tone = "bg-white" }) {
  return <div className={`rounded-2xl border border-[#D6A85A]/35 p-5 shadow-premium ${tone === "bg-white" ? "bg-[#FFFDF8]" : tone}`}><Icon className="text-orangeWarm" /><p className="mt-4 text-sm font-bold text-chocolate">{label}</p><p className="text-3xl font-black text-coffee">{value}</p></div>;
}

export function OrderCard({ order, mode = "student" }) {
  const { cancelOrder, acceptOrder, markOutForDelivery, markNearClass, confirmDelivery, submitReview, currentUser, money } = useApp();
  const [reviewOpen, setReviewOpen] = useState(false);
  const orderId = order.id || order._id || order.orderId;
  return (
    <GlassCard className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Order ID</p>
          <h3 className="font-black text-coffee">{order.orderId}</h3>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="mt-4 grid gap-3 text-sm text-muted md:grid-cols-2">
        <div className="md:col-span-2">
          <b className="text-coffee">Items:</b>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {order.items.map((i) => (
              <div key={`${order.orderId}-${i.name}`} className="flex items-center gap-2 rounded-xl bg-[#FFF7ED] p-2">
                <img src={getImageUrl(i.image, i.name)} alt={i.name} className="h-12 w-12 rounded-lg object-cover" onError={handleImageError} />
                <span>{i.name} x{i.quantity}</span>
              </div>
            ))}
          </div>
        </div>
        <p><b className="text-coffee">Room:</b> {order.floor}, Room {order.roomNumber}</p>
        <p><b className="text-coffee">Department:</b> {order.department}</p>
        <p><b className="text-coffee">Speed:</b> {order.speedOption}</p>
        <p><b className="text-coffee">Payment:</b> Paid from RoomBites wallet</p>
        <p><b className="text-coffee">Phone:</b> {order.phone}</p>
        {mode === "completed" && order.studentId?.email && <p><b className="text-coffee">Student email:</b> {order.studentId.email}</p>}
        <p><b className="text-coffee">Created:</b> {new Date(order.createdAt).toLocaleString()}</p>
        {order.acceptedAt && <p><b className="text-coffee">Accepted:</b> {new Date(order.acceptedAt).toLocaleString()}</p>}
        {order.outForDeliveryAt && <p><b className="text-coffee">Out:</b> {new Date(order.outForDeliveryAt).toLocaleString()}</p>}
        {order.deliveredAt && <p><b className="text-coffee">Delivered:</b> {new Date(order.deliveredAt).toLocaleString()}</p>}
        {mode === "completed" && <p><b className="text-coffee">Student confirmation:</b> {order.studentSuccess ? "Completed" : "Pending"}</p>}
        {mode === "completed" && <p><b className="text-coffee">Delivery confirmation:</b> {order.deliveryBoySuccess ? "Completed" : "Pending"}</p>}
        {order.assignedDeliveryBoyName && <p className="md:col-span-2 rounded-xl bg-green-50 p-3 font-semibold text-green-700">Your order has been accepted by {order.assignedDeliveryBoyName}</p>}
      </div>
      <OrderTimeline order={order} />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <b className="text-xl text-coffee">{money(order.totalAmount)}</b>
        <div className="flex flex-wrap gap-2">
          {mode === "student" && ["Waiting for available delivery boy", "Assigned to delivery boy"].includes(order.status) && <GradientButton variant="ghost" onClick={() => cancelOrder(orderId)}>Cancel Order</GradientButton>}
          {mode === "student" && !order.studentSuccess && !["Cancelled", "Waiting for available delivery boy", "Assigned to delivery boy", "Delivered"].includes(order.status) && <GradientButton onClick={() => confirmDelivery(orderId, "student")}><PackageCheck size={18} /> Student Success</GradientButton>}
          {mode === "student" && order.status === "Delivered" && !order.reviewedAt && <GradientButton onClick={() => setReviewOpen(true)}><Star size={18} /> Rate Your Order</GradientButton>}
          {mode === "delivery" && order.status === "Assigned to delivery boy" && <GradientButton onClick={() => acceptOrder(orderId)}>Accept Order</GradientButton>}
          {mode === "delivery" && (order.assignedDeliveryBoyId === currentUser?.id || order.assignedDeliveryBoyId === currentUser?._id) && order.status === "Accepted by delivery boy" && <GradientButton onClick={() => markOutForDelivery(orderId)}>Out for Delivery</GradientButton>}
          {mode === "delivery" && (order.assignedDeliveryBoyId === currentUser?.id || order.assignedDeliveryBoyId === currentUser?._id) && order.status === "Out for Delivery" && <GradientButton onClick={() => markNearClass(orderId)}>Near Classroom</GradientButton>}
          {mode === "delivery" && (order.assignedDeliveryBoyId === currentUser?.id || order.assignedDeliveryBoyId === currentUser?._id) && !order.deliveryBoySuccess && ["Out for Delivery", "Near Your Class", "Waiting for Confirmation"].includes(order.status) && <GradientButton onClick={() => confirmDelivery(orderId, "delivery")}>Delivery Success</GradientButton>}
        </div>
      </div>
      <ReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onSubmit={async (payload) => {
          const result = await submitReview({ ...payload, orderId });
          if (result.ok) setReviewOpen(false);
        }}
      />
    </GlassCard>
  );
}

function OrderTimeline({ order }) {
  const steps = ["Order Placed", "Assigned to Delivery Boy", "Accepted", "Out for Delivery", "Near Your Class", "Delivered"];
  const statusToIndex = {
    "Waiting for available delivery boy": 0,
    "Assigned to delivery boy": 1,
    "Accepted by delivery boy": 2,
    "Out for Delivery": 3,
    "Near Your Class": 4,
    "Waiting for Confirmation": 4,
    Delivered: 5,
  };
  const active = order.status === "Cancelled" ? -1 : statusToIndex[order.status] ?? 0;
  return (
    <div className="mt-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
        {steps.map((step, i) => {
          const done = i < active;
          const current = i === active;
          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-3 text-center text-xs font-black ${
                done
                  ? "border-green-200 bg-green-50 text-green-700"
                  : current
                    ? "border-orangeWarm bg-orange-100 text-orange-700 shadow-[0_0_24px_rgba(249,115,22,.25)]"
                    : "border-stone-200 bg-stone-50 text-stone-500"
              }`}
            >
              <span className={`mx-auto mb-2 grid h-7 w-7 place-items-center rounded-full ${done ? "bg-success text-white" : current ? "bg-orangeWarm text-white" : "bg-stone-200 text-stone-500"}`}>
                {done ? <Check size={15} /> : i + 1}
              </span>
              {step}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewModal({ open, onClose, onSubmit }) {
  const [foodRating, setFoodRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [behaviorRating, setBehaviorRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const StarRow = ({ label, value, setValue }) => (
    <div>
      <p className="mb-2 font-black text-coffee">{label}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => setValue(star)} className={star <= value ? "text-orangeWarm" : "text-stone-300"}>
            <Star fill="currentColor" size={26} />
          </button>
        ))}
      </div>
    </div>
  );
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.form
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit({ foodRating, deliveryRating, behaviorRating, reviewText });
            }}
            className="w-full max-w-lg rounded-3xl bg-[#FFFDF8] p-6 shadow-premium"
          >
            <h3 className="text-2xl font-black text-coffee">Rate Your Order</h3>
            <p className="mt-1 text-chocolate">Help RoomBites improve food quality and delivery experience.</p>
            <div className="mt-5 grid gap-5">
              <StarRow label="Food quality" value={foodRating} setValue={setFoodRating} />
              <StarRow label="Delivery speed" value={deliveryRating} setValue={setDeliveryRating} />
              <StarRow label="Delivery boy behavior" value={behaviorRating} setValue={setBehaviorRating} />
              <textarea className="min-h-24 rounded-2xl border border-[#D6A85A]/40 bg-white px-4 py-3 text-black outline-none" placeholder="Write a short review" value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <GradientButton type="button" variant="ghost" onClick={onClose}>Close</GradientButton>
              <GradientButton type="submit">Submit Rating</GradientButton>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ConfirmModal({ open, title, message, onConfirm, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ scale: .94 }} animate={{ scale: 1 }} exit={{ scale: .94 }} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-premium">
            <h3 className="text-xl font-black text-coffee">{title}</h3>
            <p className="mt-2 text-muted">{message}</p>
            <div className="mt-6 flex justify-end gap-2">
              <GradientButton variant="ghost" onClick={onClose}>Close</GradientButton>
              <GradientButton onClick={onConfirm}>Confirm</GradientButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SuccessModal({ open, title, message, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-premium">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-success"><Check size={32} /></div>
            <h3 className="mt-4 text-2xl font-black text-coffee">{title}</h3>
            <p className="mt-2 text-muted">{message}</p>
            <GradientButton className="mt-6 w-full" onClick={onClose}>Continue</GradientButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function EmptyState({ title = "Nothing here yet", text = "Your RoomBites activity will appear here.", compact = false }) {
  return <div className={`grid place-items-center rounded-2xl bg-white/70 text-center ${compact ? "p-6" : "min-h-64 p-10"}`}><div><Search className="mx-auto text-caramel" /><h3 className="mt-3 font-black text-coffee">{title}</h3><p className="mt-1 text-sm text-muted">{text}</p></div></div>;
}

export function LoadingSkeleton() {
  return <div className="animate-pulse rounded-2xl bg-orange-100/80 p-6"><div className="h-40 rounded-xl bg-orange-200/80" /><div className="mt-4 h-5 w-2/3 rounded bg-orange-200" /><div className="mt-3 h-4 rounded bg-orange-100" /></div>;
}

export function Sidebar({ links }) {
  return (
    <aside className="glass sticky top-24 hidden h-[calc(100vh-7rem)] rounded-2xl p-3 lg:block">
      <div className="grid gap-1">
        {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 font-bold ${isActive ? "bg-[#FEF3C7] text-[#5C3A21] ring-1 ring-[#A16207]/30" : "text-black hover:bg-[#FEF3C7]/70 hover:text-[#A16207]"}`}><Icon size={18} /> {label}</NavLink>)}
      </div>
    </aside>
  );
}

export const dashboardLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/menu", label: "Browse Menu", icon: Utensils },
  { to: "/cart", label: "Cart", icon: ShoppingCart },
  { to: "/checkout", label: "Checkout", icon: CreditCard },
  { to: "/orders", label: "Orders", icon: PackageCheck },
  { to: "/profile", label: "Profile", icon: User },
];

export { CreditCard, Home, LayoutDashboard, PackageCheck, ShoppingCart, Trash2, User, Wallet, X };
