import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, Eye, EyeOff, Lock, Mail, PackageCheck, ShieldCheck, Truck, UserRound, Users, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line as ReLine, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  CategoryCard,
  CartItem,
  ConfirmModal,
  EmptyState,
  FoodItemCard,
  GlassCard,
  GradientButton,
  OrderCard,
  SpeedDeliveryCard,
  StatsCard,
  SuccessModal,
  WalletCard,
} from "../components/ui";
import { useApp } from "../context/AppContext";
import { speedOptions } from "../data/seedData";

const page = "mx-auto max-w-7xl px-4 py-10";
const input = "w-full rounded-xl border border-[#D6A85A]/50 bg-[#FFFDF8] px-4 py-3 text-stone-950 outline-none transition placeholder:text-[#8B735F] focus:border-orangeWarm focus:ring-4 focus:ring-orangeWarm/10";

function SectionTitle({ eyebrow, title, text }) {
  return <div className="mb-8 max-w-3xl"><p className="font-black uppercase tracking-wide text-caramel">{eyebrow}</p><h1 className="mt-2 text-4xl font-black text-coffee md:text-5xl">{title}</h1>{text && <p className="mt-4 text-lg text-muted">{text}</p>}</div>;
}

export function Home() {
  return (
    <section className="relative -mt-24 overflow-hidden brown-gradient px-4 pb-16 pt-36 text-white">
      <div className="absolute inset-0 opacity-30 cream-grid" />
      {["Biryani", "Cold Coffee", "Chicken 65", "Dosa"].map((name, i) => (
        <motion.div key={name} animate={{ y: [0, -18, 0], rotate: [0, i % 2 ? 4 : -4, 0] }} transition={{ repeat: Infinity, duration: 4 + i, ease: "easeInOut" }} className={`dark-glass absolute hidden rounded-2xl px-5 py-4 font-black lg:block ${i === 0 ? "left-12 top-44" : i === 1 ? "right-14 top-36" : i === 2 ? "bottom-24 left-1/4" : "bottom-28 right-1/4"}`}>
          {name}
        </motion.div>
      ))}
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <p className="inline-flex rounded-full bg-white/15 px-4 py-2 font-bold text-orange-100">Campus canteen to your room</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight md:text-7xl">Order Food From Campus Canteen To Your Room</h1>
          <p className="mt-6 max-w-2xl text-xl text-orange-50">Skip queues, save time, and get food delivered directly to your classroom.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/menu" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-orangeWarm to-caramel px-6 py-3 font-black text-white shadow-lg shadow-orangeWarm/25 transition hover:-translate-y-0.5">Explore Menu</Link>
            <Link to="/login" className="rounded-xl bg-white px-6 py-3 font-black text-coffee transition hover:-translate-y-0.5">Login Now</Link>
          </div>
        </div>
        <GlassCard className="relative overflow-hidden p-4">
          <img className="h-[520px] w-full rounded-2xl object-cover" src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80" alt="Campus food bowl" />
          <div className="absolute bottom-8 left-8 right-8 rounded-2xl bg-white/85 p-5 text-coffee backdrop-blur">
            <p className="text-sm font-bold text-caramel">RoomBites wallet</p>
            <p className="text-2xl font-black">₹1,00,000 for every account</p>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

export function About() {
  const benefits = ["Saves time between classes", "Avoids long canteen queues", "Helps during hot summer afternoons", "Delivers to room and floor", "Fast delivery options from 5 to 20 minutes"];
  return (
    <div className={page}>
      <SectionTitle eyebrow="About" title="RoomBites brings the campus canteen closer." text="A campus food delivery product for students who want food without losing half a break standing in line." />
      <div className="grid gap-6 lg:grid-cols-3">
        {["Choose food", "Pick delivery speed", "Pay from RoomBites wallet"].map((step, i) => <GlassCard key={step} className="p-6"><div className="grid h-12 w-12 place-items-center rounded-xl bg-coffee text-white">{i + 1}</div><h3 className="mt-5 text-xl font-black text-coffee">{step}</h3><p className="mt-2 text-muted">RoomBites keeps the campus workflow fast, visual, and simple from menu to delivery.</p></GlassCard>)}
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-5">
        {benefits.map((b) => <div key={b} className="rounded-2xl bg-white p-5 font-bold text-coffee shadow-premium"><CheckCircle2 className="mb-3 text-success" />{b}</div>)}
      </div>
    </div>
  );
}

export function MenuCategories() {
  const { categories } = useApp();
  return <div className={page}><SectionTitle eyebrow="Menu" title="20 campus food categories" text="Browse rich canteen categories with premium cards, responsive layout, and quick item navigation." /><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{categories.map((c) => <CategoryCard key={c.id} category={c} />)}</div></div>;
}

export function CategoryItems() {
  const { categoryId } = useParams();
  const { categories, foodItems } = useApp();
  const category = categories.find((c) => c.id === categoryId);
  const items = foodItems.filter((i) => i.categoryId === categoryId);
  if (!category) return <NotFound />;
  return <div className={page}><SectionTitle eyebrow="Category" title={category.name} text={category.description} /><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <FoodItemCard key={item.id} item={item} />)}</div></div>;
}

export function Cart() {
  const { cartItems, cartSubtotal, deliveryCharge, money, currentUser } = useApp();
  if (currentUser?.role === "delivery") return <Navigate to="/delivery-dashboard" replace />;
  if (currentUser?.role === "admin") return <Navigate to="/admin-dashboard" replace />;
  const total = cartSubtotal + deliveryCharge;
  return (
    <div className={page}>
      <SectionTitle eyebrow="Cart" title="Review your canteen order" text="Adjust quantities, remove items, and continue to checkout when everything looks right." />
      {!cartItems.length ? <EmptyState title="Your cart is empty" text="Explore the menu and add your first RoomBites order." /> : (
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-4">{cartItems.map((item) => <CartItem key={item.id} item={item} />)}</div>
          <GlassCard className="h-fit p-6">
            <h3 className="text-2xl font-black text-coffee">Bill Summary</h3>
            <Line label="Subtotal" value={money(cartSubtotal)} />
            <Line label="Delivery charge" value={money(deliveryCharge)} />
            <Line label="Speed delivery charge" value="Choose at checkout" />
            <div className="mt-5 border-t border-orange-100 pt-5"><Line label="Grand total now" value={money(total)} strong /></div>
            <Link to="/checkout" className="mt-6 flex w-full justify-center rounded-xl bg-coffee px-5 py-3 font-black text-white">Proceed to Checkout</Link>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

function Line({ label, value, strong }) {
  return <div className={`mt-4 flex justify-between ${strong ? "text-xl font-black text-black" : "font-semibold text-[#3B2416]"}`}><span>{label}</span><b className="text-black">{value}</b></div>;
}

export function Checkout() {
  const { currentUser, cartItems, cartSubtotal, deliveryCharge, placeOrder, money, showToast, applyCoupon, createGroupOrder, joinGroupOrder } = useApp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(speedOptions[3]);
  const [success, setSuccess] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [form, setForm] = useState({ studentName: currentUser?.name || "", roomNumber: "", floor: "Ground Floor", department: currentUser?.department || "", phone: currentUser?.phone || "", deliveryNote: "", couponCode: "" });
  const couponDiscount = coupon?.discountType === "delivery" ? Math.min(deliveryCharge, coupon.amount) : coupon?.discountType === "speed" ? Math.min(selected.charge, coupon.amount) : coupon?.amount || 0;
  const total = Math.max(0, cartSubtotal + deliveryCharge + selected.charge - couponDiscount);
  if (!cartItems.length && !success) {
    return (
      <div className={page}>
        <EmptyState title="Your cart is empty. Add food before checkout." text="Choose something delicious from the menu, then come back to place your order." />
        <div className="mt-6 text-center">
          <Link to="/menu" className="inline-flex rounded-xl bg-coffee px-5 py-3 font-black text-white">Go to Menu</Link>
        </div>
      </div>
    );
  }
  const submit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login before placing order", "error");
      navigate("/login");
      return;
    }
    const result = await placeOrder(form, selected);
    if (!result.ok) {
      showToast(result.message, "error");
      if (result.redirectToLogin) navigate("/login");
      return;
    }
    setSuccess(true);
  };
  return (
    <div className={page}>
      <SectionTitle eyebrow="Checkout" title="Tell us where to deliver" text="Your order is paid from the RoomBites wallet instantly." />
      <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <GlassCard className="grid gap-4 bg-[#FFFDF8] p-6 text-black md:grid-cols-2">
          <input className={input} required placeholder="Student name" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} />
          <input className={input} required placeholder="Room number" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} />
          <select className={input} value={form.floor} onChange={(e) => setForm({ ...form, floor: e.target.value })}>{["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor"].map((f) => <option key={f}>{f}</option>)}</select>
          <input className={input} required placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          <input className={input} required placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <textarea className={`${input} md:col-span-2`} placeholder="Delivery note" value={form.deliveryNote} onChange={(e) => setForm({ ...form, deliveryNote: e.target.value })} />
          <div className="md:col-span-2">
            <h3 className="mb-4 text-xl font-black text-black">Speed Delivery</h3>
            <div className="grid gap-4 md:grid-cols-4">{speedOptions.map((o) => <SpeedDeliveryCard key={o.id} option={o} selected={selected.id === o.id} onClick={() => setSelected(o)} />)}</div>
          </div>
          <div className="md:col-span-2 rounded-2xl bg-[#FEF3C7] p-5">
            <h3 className="text-xl font-black text-black">Campus Offers & Group Ordering</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
              <input className={input} placeholder="Coupon code: WELCOME50, FREEDEL, FAST10" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} />
              <button
                type="button"
                className="rounded-xl bg-coffee px-5 py-3 font-black text-white"
                onClick={async () => {
                  const result = await applyCoupon(couponCode);
                  if (result.ok) {
                    setCoupon(result.coupon);
                    setForm({ ...form, couponCode: result.coupon.code });
                  }
                }}
              >
                Apply
              </button>
            </div>
            {coupon && <p className="mt-2 font-bold text-green-700">{coupon.code} applied. Discount: {money(couponDiscount)}</p>}
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <button type="button" className="rounded-xl bg-[#FFFDF8] px-4 py-3 font-black text-coffee" onClick={createGroupOrder}>Create Group Order</button>
              <input className={input} placeholder="Join code" value={groupCode} onChange={(e) => setGroupCode(e.target.value.toUpperCase())} />
              <button type="button" className="rounded-xl bg-orangeWarm px-4 py-3 font-black text-white" onClick={() => joinGroupOrder(groupCode)}>Join Group</button>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="h-fit bg-[#FFFDF8] p-6 text-black">
          <WalletCard balance={currentUser.walletBalance} />
          <Line label="Subtotal" value={money(cartSubtotal)} />
          <Line label="Delivery charge" value={money(deliveryCharge)} />
          <Line label="Speed delivery charge" value={money(selected.charge)} />
          <Line label="Coupon discount" value={`-${money(couponDiscount)}`} />
          <div className="mt-5 border-t border-orange-100 pt-5"><Line label="Final total" value={money(total)} strong /></div>
          <GradientButton className="mt-6 w-full" type="submit">Book Order</GradientButton>
        </GlassCard>
      </form>
      <SuccessModal open={success} title="Order placed successfully" message="Your RoomBites wallet was charged and the order is now visible to delivery boys." onClose={() => navigate("/orders")} />
    </div>
  );
}

const roleLabels = { student: "Student", delivery: "Delivery Boy", admin: "Admin" };

export function Register() {
  const { register, login, showToast } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", studentId: "", deliveryId: "", adminId: "", department: "", year: "", phone: "" });
  const submit = async (e) => {
    e.preventDefault();
    const result = await register({ ...form, fullName: form.name, role });
    if (!result.ok) return showToast(result.message, "error");
    navigate(role === "delivery" ? "/delivery-dashboard" : role === "admin" ? "/admin-dashboard" : "/dashboard");
  };
  return <AuthShell title="Create your RoomBites account" role={role} setRole={setRole} onSubmit={submit} form={form} setForm={setForm} mode="register" />;
}

export function Login() {
  const { login, showToast } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({ email: "", password: "" });
  const submit = async (e) => {
    e.preventDefault();
    const email = form.email.trim().toLowerCase();
    if (["student", "delivery"].includes(role) && !email.endsWith("@gmail.com")) return showToast("Only Gmail accounts are allowed", "error");
    if (role === "admin" && email !== "sathwikgolla06@gmail.com") return showToast("Unauthorized admin access", "error");
    const result = await login(role, email, form.password);
    if (!result.ok) return showToast(result.message, "error");
    navigate(role === "delivery" ? "/delivery-dashboard" : role === "admin" ? "/admin-dashboard" : "/dashboard");
  };
  return <AuthShell title="Login to RoomBites" role={role} setRole={setRole} onSubmit={submit} form={form} setForm={setForm} mode="login" />;
}

function AuthShell({ title, role, setRole, onSubmit, form, setForm, mode }) {
  const roleText = mode === "register" ? { student: "Register as Student", delivery: "Register as Delivery Boy", admin: "Register as Admin" } : { student: "Student Login", delivery: "Delivery Boy Login", admin: "Admin Login" };
  const [showPassword, setShowPassword] = useState(false);
  const roleDetails = {
    student: { label: "Student", text: "Order food to your room, floor, or classroom.", icon: UserRound },
    delivery: { label: "Delivery Boy", text: "Accept campus orders and complete deliveries.", icon: Truck },
    admin: { label: "Admin", text: "Monitor users, orders, wallets, and revenue.", icon: ShieldCheck },
  };
  const isRegister = mode === "register";
  const passwordType = showPassword ? "text" : "password";
  return (
    <div className="auth-dark relative -mt-24 min-h-[calc(100vh+6rem)] overflow-hidden bg-[#111016] px-4 pb-16 pt-32 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(249,115,22,.22),transparent_32%),radial-gradient(circle_at_82%_10%,rgba(161,98,7,.18),transparent_30%),linear-gradient(135deg,#111016_0%,#1a171f_48%,#24160d_100%)]" />
      <div className="absolute left-8 top-32 h-32 w-32 rounded-full bg-orangeWarm/10 blur-3xl" />
      <div className="absolute bottom-16 right-10 h-40 w-40 rounded-full bg-caramel/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-[#121119] shadow-[0_30px_90px_rgba(0,0,0,.45)] lg:grid-cols-[.86fr_1fr]">
        <aside className="relative hidden min-h-[660px] overflow-hidden bg-[#0d0c12] p-8 lg:block">
          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" className="text-2xl font-black tracking-wide text-orangeWarm">ROOMBITES</Link>
            <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-bold text-orange-50 transition hover:bg-white/14">
              Back to website <ArrowRight size={15} />
            </Link>
          </div>
          <div className="relative z-10 mt-8 h-[500px] overflow-hidden rounded-[1.6rem] border border-white/10">
            <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80" alt="RoomBites food delivery" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-3xl font-black leading-tight">Fast campus food,<br />delivered with style</p>
              <div className="mt-8 flex gap-2">
                <span className="h-1 w-4 rounded-full bg-white/30" />
                <span className="h-1 w-4 rounded-full bg-white/30" />
                <span className="h-1 w-9 rounded-full bg-white" />
              </div>
            </div>
          </div>
          <motion.div animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute bottom-12 right-8 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs font-bold text-orange-100">Demo wallet</p>
            <p className="text-xl font-black">₹1,00,000</p>
          </motion.div>
        </aside>

        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8 flex items-center justify-between gap-4 lg:hidden">
            <Link to="/" className="text-2xl font-black text-orangeWarm">ROOMBITES</Link>
            <Link to="/" className="rounded-full bg-white/8 px-4 py-2 text-sm font-bold text-orange-50">Back</Link>
          </div>
          <div className="max-w-2xl">
            <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">{title}</h1>
            <p className="mt-3 text-[#D6C6B8]">
              {isRegister ? "Already have an account? " : "New to RoomBites? "}
              <Link className="font-bold text-orange-200 underline underline-offset-4" to={isRegister ? "/login" : "/register"}>
                {isRegister ? "Log in" : "Create account"}
              </Link>
            </p>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {Object.keys(roleLabels).map((r) => {
              const Icon = roleDetails[r].icon;
              return (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`group rounded-2xl border p-4 text-left transition ${role === r ? "border-[#F97316] bg-[#F97316] text-white shadow-[0_18px_35px_rgba(249,115,22,.28)]" : "border-white/15 bg-[#1F1D27] text-[#FFF7ED] hover:border-[#F97316]/80 hover:bg-[#282532]"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`grid h-10 w-10 place-items-center rounded-xl ${role === r ? "bg-white/20 text-white" : "bg-black/25 text-orange-200"}`}><Icon size={19} /></span>
                    <span className="font-black text-inherit">{roleDetails[r].label}</span>
                  </div>
                  <p className={`mt-3 text-xs font-medium leading-relaxed ${role === r ? "text-white" : "text-[#D6C6B8]"}`}>{roleDetails[r].text}</p>
                </button>
              );
            })}
          </div>

          <form onSubmit={onSubmit} className="mt-7 grid gap-4 md:grid-cols-2">
            {isRegister && <DarkInput icon={UserRound} required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
            <DarkInput icon={Mail} className={isRegister ? "" : "md:col-span-2"} required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {isRegister && role === "student" && (
              <>
                <DarkInput required placeholder="Student ID" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
                <DarkInput required placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                <DarkInput required placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
                <DarkInput required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </>
            )}
            {isRegister && role === "delivery" && (
              <>
                <DarkInput required placeholder="Delivery ID" value={form.deliveryId} onChange={(e) => setForm({ ...form, deliveryId: e.target.value })} />
                <DarkInput required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </>
            )}
            {isRegister && role === "admin" && <DarkInput className="md:col-span-2" required placeholder="Admin ID" value={form.adminId} onChange={(e) => setForm({ ...form, adminId: e.target.value })} />}
            <div className="relative md:col-span-2">
              <DarkInput icon={Lock} required type={passwordType} placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D6C6B8] transition hover:text-white" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {isRegister && <DarkInput className="md:col-span-2" icon={Lock} required type={passwordType} placeholder="Confirm password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />}
            {isRegister && (
              <label className="flex items-center gap-3 text-sm text-[#D6C6B8] md:col-span-2">
                <input required type="checkbox" className="h-5 w-5 accent-orangeWarm" />
                I agree to the <span className="font-bold text-orange-200 underline underline-offset-4">RoomBites terms</span>
              </label>
            )}
            <button className="md:col-span-2 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#A16207] px-6 py-4 text-lg font-black text-white shadow-[0_18px_35px_rgba(249,115,22,.34)] transition hover:-translate-y-0.5 hover:from-[#EA580C] hover:to-[#854D0E]" type="submit">
              {isRegister ? roleText[role] : roleText[role]}
            </button>
          </form>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[.07] p-4 text-sm font-semibold text-[#FFF7ED]">
            Students and delivery agents must use Gmail accounts. Admin access is restricted to the authorized RoomBites owner email.
          </div>
        </section>
      </div>
    </div>
  );
}

function DarkInput({ icon: Icon, className = "", ...props }) {
  return (
    <div className={`relative ${className}`}>
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D6C6B8]" size={18} />}
      <input
        className={`w-full rounded-2xl border border-white/15 bg-white/[.07] px-5 py-4 text-white outline-none transition placeholder:text-[#BFA995] focus:border-orangeWarm focus:bg-white/[.1] focus:ring-4 focus:ring-orangeWarm/10 ${Icon ? "pl-12" : ""}`}
        {...props}
      />
    </div>
  );
}

export function DashboardRouter() {
  const { currentUser } = useApp();
  if (currentUser.role === "delivery") return <Navigate to="/delivery-dashboard" replace />;
  if (currentUser.role === "admin") return <Navigate to="/admin-dashboard" replace />;
  return <Navigate to="/student-dashboard" replace />;
}

export function StudentDashboard() {
  const { currentUser, token, studentOrders, fetchStudentOrders, showToast } = useApp();
  useEffect(() => {
    if (!currentUser || !token) return;
    fetchStudentOrders().catch(() => showToast("Could not load dashboard orders", "error"));
    const interval = setInterval(() => {
      fetchStudentOrders().catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [currentUser, fetchStudentOrders, showToast, token]);
  return <DashboardLayout title={`Welcome, ${currentUser.name}`}><StatsGrid orders={studentOrders} /><div className="mt-8 grid gap-4 md:grid-cols-5">{[["Browse Menu", "/menu"], ["View Cart", "/cart"], ["Checkout", "/checkout"], ["My Orders", "/orders"], ["Profile", "/profile"]].map(([label, to]) => <Link key={to} className="rounded-2xl bg-white p-6 text-center font-black text-coffee shadow-premium transition hover:-translate-y-1" to={to}>{label}</Link>)}</div></DashboardLayout>;
}

function StatsGrid({ orders }) {
  const active = orders.filter((o) => !["Delivered", "Cancelled"].includes(o.status)).length;
  return <div className="grid gap-4 md:grid-cols-4"><StatsCard icon={PackageCheck} label="Total orders" value={orders.length} /><StatsCard icon={Clock} label="Active orders" value={active} /><StatsCard icon={CheckCircle2} label="Delivered" value={orders.filter((o) => o.status === "Delivered").length} /><StatsCard icon={ShieldCheck} label="Cancelled" value={orders.filter((o) => o.status === "Cancelled").length} /></div>;
}

export function DeliveryDashboard() {
  const { deliveryActiveOrders, completedDeliveryOrders, deliveryEarnings, currentUser, token, fetchDeliveryOrders, fetchCompletedDeliveryOrders, fetchDeliveryEarnings, updateDeliveryStatus, showToast, money } = useApp();
  const [tab, setTab] = useState("active");
  useEffect(() => {
    if (!currentUser || !token) return;
    fetchDeliveryOrders().catch(() => showToast("Could not load delivery orders", "error"));
    fetchCompletedDeliveryOrders().catch(() => {});
    fetchDeliveryEarnings().catch(() => {});
    const interval = setInterval(() => {
      fetchDeliveryOrders().catch(() => {});
      fetchCompletedDeliveryOrders().catch(() => {});
      fetchDeliveryEarnings().catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [currentUser, fetchCompletedDeliveryOrders, fetchDeliveryEarnings, fetchDeliveryOrders, showToast, token]);
  const visible = deliveryActiveOrders;
  const accepted = visible.filter((o) => !["Delivered", "Cancelled"].includes(o.status));
  const isAvailable = (currentUser.availabilityStatus || "available") === "available";
  const toggleAvailability = () => updateDeliveryStatus(isAvailable ? "busy" : "available");
  const displayOrders = tab === "active" ? visible : completedDeliveryOrders;
  return (
    <DashboardLayout title={`Welcome, ${currentUser.name}`}>
      <GlassCard className={`mb-8 p-6 ${isAvailable ? "bg-green-50" : "bg-orange-50"}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className={`text-sm font-black uppercase tracking-wide ${isAvailable ? "text-green-700" : "text-orange-700"}`}>Availability</p>
            <h2 className="mt-1 text-2xl font-black text-coffee">{isAvailable ? "Available for Orders" : "Busy / Not Accepting Orders"}</h2>
            <p className="mt-2 font-semibold text-chocolate">{isAvailable ? "You are available to receive orders." : "You are busy. New orders will not be assigned to you."}</p>
          </div>
          <button onClick={toggleAvailability} className={`rounded-xl px-5 py-3 font-black text-white shadow-premium transition hover:-translate-y-0.5 ${isAvailable ? "bg-orangeWarm" : "bg-success"}`}>
            Mark {isAvailable ? "Busy" : "Available"}
          </button>
        </div>
      </GlassCard>
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <StatsCard icon={PackageCheck} label="Assigned Orders" value={deliveryActiveOrders.filter((o) => o.status === "Assigned to delivery boy").length} />
        <StatsCard icon={Truck} label="Accepted Orders" value={accepted.length} />
        <StatsCard icon={CheckCircle2} label="Success Orders" value={completedDeliveryOrders.length} />
      </div>
      <div className="mb-8 grid gap-4 md:grid-cols-5">
        <StatsCard icon={CheckCircle2} label="Completed Today" value={deliveryEarnings?.completedToday ?? 0} />
        <StatsCard icon={PackageCheck} label="Total Completed" value={deliveryEarnings?.totalCompleted ?? completedDeliveryOrders.length} />
        <StatsCard icon={Wallet} label="Today Earnings" value={money(deliveryEarnings?.todayEarnings ?? 0)} tone="bg-green-50" />
        <StatsCard icon={Wallet} label="Total Earnings" value={money(deliveryEarnings?.totalEarnings ?? 0)} tone="bg-green-50" />
        <StatsCard icon={Clock} label="Avg Delivery Time" value={`${deliveryEarnings?.averageDeliveryTime ?? 0} min`} />
      </div>
      <div className="mb-6 flex flex-wrap gap-3">
        <button onClick={() => setTab("active")} className={`rounded-xl px-5 py-3 font-black ${tab === "active" ? "bg-coffee text-white" : "bg-[#FEF3C7] text-coffee"}`}>Active Orders</button>
        <button onClick={() => setTab("completed")} className={`rounded-xl px-5 py-3 font-black ${tab === "completed" ? "bg-coffee text-white" : "bg-[#FEF3C7] text-coffee"}`}>Success Orders</button>
      </div>
      <SectionTitle eyebrow="Orders" title={tab === "active" ? "Your active deliveries" : "Completed delivery history"} />
      <div className="grid gap-5">
        {displayOrders.length ? displayOrders.map((o) => <OrderCard key={o.orderId} order={o} mode={tab === "active" ? "delivery" : "completed"} />) : <EmptyState title={tab === "active" ? (isAvailable ? "You are available. Waiting for new orders." : "You are busy. Turn available to receive orders.") : "No completed deliveries yet"} />}
      </div>
    </DashboardLayout>
  );
}

export function AdminDashboard() {
  const { users, adminOrders, dashboardStats, analytics, currentUser, token, deleteUser, cancelOrder, markResolved, money, fetchAdminData, showToast } = useApp();
  useEffect(() => {
    if (!currentUser || !token) return;
    fetchAdminData().catch(() => showToast("Could not load admin data", "error"));
  }, [currentUser, fetchAdminData, showToast, token]);
  const students = users.filter((u) => u.role === "student");
  const delivery = users.filter((u) => u.role === "delivery");
  const revenue = adminOrders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.totalAmount, 0);
  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid gap-4 md:grid-cols-4"><StatsCard icon={Users} label="Students" value={dashboardStats?.totalStudents ?? students.length} /><StatsCard icon={Truck} label="Available boys" value={dashboardStats?.activeDeliveryBoys ?? delivery.filter((u) => u.availabilityStatus === "available").length} /><StatsCard icon={PackageCheck} label="Pending unassigned" value={dashboardStats?.unassignedPendingOrders ?? adminOrders.filter((o) => o.status === "Waiting for available delivery boy").length} /><StatsCard icon={Wallet} label="Revenue" value={money(dashboardStats?.totalRevenue ?? revenue)} /></div>
      <div className="mt-4 grid gap-4 md:grid-cols-4">
        <StatsCard icon={PackageCheck} label="Orders Today" value={dashboardStats?.todayOrders ?? 0} />
        <StatsCard icon={Clock} label="Avg Delivery Time" value={`${dashboardStats?.averageDeliveryTime ?? 0} min`} />
        <StatsCard icon={Truck} label="Near Class Orders" value={dashboardStats?.nearClassOrders ?? 0} />
        <StatsCard icon={CheckCircle2} label="Smart Saved Time" value={`${dashboardStats?.smartGroupedMinutesSavedToday ?? 0} min`} />
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Orders by Category"><BarChart data={analytics?.ordersByCategory || []}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" hide /><YAxis /><Tooltip /><Bar dataKey="orders" fill="#A16207" radius={[8, 8, 0, 0]} /></BarChart></ChartCard>
        <ChartCard title="Revenue Chart"><AreaChart data={analytics?.revenueChart || []}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Area dataKey="revenue" stroke="#5C3A21" fill="#F97316" fillOpacity={0.25} /></AreaChart></ChartCard>
        <ChartCard title="Peak Ordering Hours"><LineChart data={analytics?.peakHours || []}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="hour" /><YAxis /><Tooltip /><ReLine type="monotone" dataKey="orders" stroke="#F97316" strokeWidth={3} /></LineChart></ChartCard>
        <ChartCard title="Delivery Performance"><BarChart data={analytics?.deliveryPerformance || []}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" hide /><YAxis /><Tooltip /><Bar dataKey="delivered" fill="#22C55E" radius={[8, 8, 0, 0]} /></BarChart></ChartCard>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <InsightList title="Most Ordered Foods" rows={analytics?.mostOrderedFoods || []} valueKey="quantity" />
        <InsightList title="Top Rated Delivery Boys" rows={analytics?.topDeliveryBoys || []} valueKey="rating" />
        <InsightList title="Delivery Heatmap" rows={[...(analytics?.heatmapFloors || []), ...(analytics?.heatmapDepartments || [])]} valueKey="orders" />
      </div>
      <AdminTable title="Users table" rows={users} cols={["fullName", "email", "role", "availabilityStatus", "walletBalance"]} renderActions={(u) => <button className="text-danger" onClick={() => deleteUser(u._id || u.id)}>Cancel user</button>} />
      {dashboardStats?.deliveryLoad?.length ? <AdminTable title="Delivery Load" rows={dashboardStats.deliveryLoad} cols={["deliveryBoyName", "deliveryId", "availabilityStatus", "activeOrderCount"]} renderActions={() => null} /> : null}
      <AdminTable title="Orders table" rows={adminOrders} cols={["orderId", "studentName", "assignedDeliveryBoyName", "status", "totalAmount"]} renderActions={(o) => <div className="flex gap-3"><button className="text-danger" onClick={() => cancelOrder(o.id || o._id, true)}>Cancel</button><button className="text-caramel" onClick={() => markResolved(o.id || o._id)}>Mark resolved</button></div>} />
    </DashboardLayout>
  );
}

function ChartCard({ title, children }) {
  return (
    <GlassCard className="h-80 p-5">
      <h3 className="mb-4 text-xl font-black text-coffee">{title}</h3>
      <ResponsiveContainer width="100%" height="82%">{children}</ResponsiveContainer>
    </GlassCard>
  );
}

function InsightList({ title, rows, valueKey }) {
  return (
    <GlassCard className="p-5">
      <h3 className="mb-4 text-xl font-black text-coffee">{title}</h3>
      <div className="grid gap-3">
        {rows.length ? rows.slice(0, 6).map((row, index) => (
          <div key={`${title}-${row.name}-${index}`} className="flex items-center justify-between rounded-xl bg-[#FFF7ED] px-4 py-3">
            <span className="font-bold text-coffee">{row.name || `Item ${index + 1}`}</span>
            <span className="rounded-full bg-[#FEF3C7] px-3 py-1 font-black text-caramel">{row[valueKey]}</span>
          </div>
        )) : <p className="text-chocolate">No analytics data yet.</p>}
      </div>
    </GlassCard>
  );
}

function AdminTable({ title, rows, cols, renderActions }) {
  const { money } = useApp();
  return <GlassCard className="mt-8 overflow-auto p-5"><h3 className="mb-4 text-xl font-black text-coffee">{title}</h3><table className="w-full min-w-[720px] text-left text-sm"><thead><tr className="text-muted">{cols.map((c) => <th key={c} className="p-3 capitalize">{c}</th>)}<th className="p-3">Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id || row.orderId} className="border-t border-orange-100">{cols.map((c) => <td key={c} className="p-3">{c.toLowerCase().includes("amount") || c.toLowerCase().includes("balance") ? money(row[c]) : row[c]}</td>)}<td className="p-3">{renderActions(row)}</td></tr>)}</tbody></table></GlassCard>;
}

function DashboardLayout({ title, children }) {
  return <div className={page}><SectionTitle eyebrow="Dashboard" title={title} />{children}</div>;
}

export function Orders() {
  const { studentOrders, deliveryActiveOrders, adminOrders, currentUser, token, fetchStudentOrders, fetchDeliveryOrders, fetchAdminData, showToast } = useApp();
  const [tab, setTab] = useState("active");
  useEffect(() => {
    if (!currentUser || !token) return;
    const load = currentUser.role === "student" ? fetchStudentOrders : currentUser.role === "delivery" ? fetchDeliveryOrders : fetchAdminData;
    load().catch(() => showToast("Could not load orders", "error"));
    const interval = setInterval(() => {
      load().catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [currentUser, fetchAdminData, fetchDeliveryOrders, fetchStudentOrders, showToast, token]);
  const source = currentUser.role === "student" ? studentOrders : currentUser.role === "delivery" ? deliveryActiveOrders : adminOrders;
  const activeStatuses = ["Waiting for available delivery boy", "Assigned to delivery boy", "Accepted by delivery boy", "Out for Delivery", "Near Your Class", "Waiting for Confirmation"];
  const activeOrders = source.filter((order) => activeStatuses.includes(order.status));
  const historyOrders = currentUser.role === "student" ? source.filter((order) => ["Delivered", "Cancelled"].includes(order.status)) : source;
  const visible = currentUser.role === "student" ? (tab === "active" ? activeOrders : historyOrders) : source;
  return <div className={page}><SectionTitle eyebrow="Orders" title="Order history" text="Track status, confirmations, delivery boy assignment, and cancellation/refund flow." />{currentUser.role === "student" && <div className="mb-6 flex flex-wrap gap-3"><button onClick={() => setTab("active")} className={`rounded-xl px-5 py-3 font-black ${tab === "active" ? "bg-coffee text-white" : "bg-[#FEF3C7] text-coffee"}`}>Active Orders</button><button onClick={() => setTab("history")} className={`rounded-xl px-5 py-3 font-black ${tab === "history" ? "bg-coffee text-white" : "bg-[#FEF3C7] text-coffee"}`}>Order History</button></div>}<div className="grid gap-5">{visible.length ? visible.map((o) => <OrderCard key={o.id || o._id || o.orderId} order={o} mode={currentUser.role === "delivery" ? "delivery" : "student"} />) : <EmptyState title={currentUser.role === "student" && tab === "history" ? "No previous orders" : "No orders yet"} />}</div></div>;
}

export function Notifications() {
  const { notifications, currentUser, token, fetchNotifications, markNotificationRead, markAllNotificationsRead, showToast } = useApp();
  useEffect(() => {
    if (!currentUser || !token) return;
    fetchNotifications().catch(() => showToast("Could not load notifications", "error"));
    const interval = setInterval(() => {
      fetchNotifications().catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [currentUser, fetchNotifications, showToast, token]);
  return <div className={page}><SectionTitle eyebrow="Notifications" title="RoomBites updates" /><div className="mb-5 flex justify-end"><button className="rounded-xl bg-coffee px-4 py-2 font-bold text-white" onClick={markAllNotificationsRead}>Mark all read</button></div><div className="grid gap-4">{notifications.length ? notifications.map((n) => <GlassCard key={n.id} className="p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="font-black text-coffee">{n.title}</h3><p className="text-muted">{n.message}</p><p className="mt-2 text-xs text-muted">{new Date(n.createdAt).toLocaleString()}</p></div>{!n.read && <button className="rounded-xl bg-[#FEF3C7] px-3 py-2 text-sm font-bold text-coffee" onClick={() => markNotificationRead(n.id)}>Read</button>}</div></GlassCard>) : <EmptyState title="No notifications" />}</div></div>;
}

export function Profile() {
  const { currentUser, updateProfile, cancelAccount } = useApp();
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [form, setForm] = useState(currentUser);
  const idLabel = currentUser.studentId || currentUser.deliveryId || currentUser.adminId;
  return (
    <div className={`${page} max-w-4xl`}>
      <SectionTitle eyebrow="Profile" title="Your RoomBites account" />
      <GlassCard className="bg-[#FFFDF8] p-6 text-black">
        <WalletCard balance={currentUser.walletBalance} />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {["name", "email", "phone", "department", "year"].map((key) => currentUser[key] !== undefined && <input key={key} className={input} disabled={!editing || key === "email"} value={form[key] || ""} placeholder={key} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />)}
          <div className="rounded-xl bg-[#FEF3C7] p-4 text-black"><b className="text-black">Role:</b> {currentUser.role}</div>
          <div className="rounded-xl bg-[#FEF3C7] p-4 text-black"><b className="text-black">ID:</b> {idLabel}</div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {!editing ? <GradientButton onClick={() => setEditing(true)}>Edit profile</GradientButton> : <GradientButton onClick={async () => { await updateProfile(form); setEditing(false); }}>Save profile</GradientButton>}
          <button className="rounded-xl bg-red-50 px-5 py-3 font-black text-danger" onClick={() => setConfirm(true)}>Cancel Account</button>
        </div>
      </GlassCard>
      <ConfirmModal open={confirm} title="Cancel account?" message="Are you sure you want to cancel your account? You will be logged out and this account cannot login again." onClose={() => setConfirm(false)} onConfirm={cancelAccount} />
    </div>
  );
}

export function NotFound() {
  return <div className={page}><EmptyState title="404 Not Found" text="That RoomBites page is not on the menu." /><div className="mt-6 text-center"><Link className="font-black text-caramel" to="/">Back to home</Link></div></div>;
}
