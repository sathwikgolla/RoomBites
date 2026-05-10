import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, Phone, ShieldCheck, Truck, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const roles = {
  student: { label: "Student", text: "Order food to your classroom, room, or floor.", icon: UserRound },
  delivery: { label: "Delivery Boy", text: "Accept campus orders and complete deliveries.", icon: Truck },
  admin: { label: "Admin", text: "Manage users, orders, wallets, and reports.", icon: ShieldCheck },
};

const initialForm = {
  fullName: "",
  email: "",
  studentId: "",
  deliveryId: "",
  adminId: "",
  department: "",
  year: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const redirectFor = {
  student: "/dashboard",
  delivery: "/delivery-dashboard",
  admin: "/admin-dashboard",
};

const AUTHORIZED_ADMIN_EMAIL = "sathwikgolla06@gmail.com";

const backendFieldMap = {
  "Email already registered": "email",
  "Phone number already in use": "phone",
  "Student ID already exists": "studentId",
  "Delivery ID already exists": "deliveryId",
  "Admin ID already exists": "adminId",
  "Invalid student account": "email",
  "Invalid delivery account": "email",
  "Invalid admin account": "email",
  "Only Gmail accounts are allowed": "email",
  "Unauthorized admin email": "email",
};

export default function Register() {
  const { register, showToast } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fields = useMemo(() => {
    const base = [
      { key: "fullName", label: "Full Name", icon: UserRound },
      { key: "email", label: "Email", type: "email", icon: Mail },
    ];
    if (role === "student") {
      base.push(
        { key: "studentId", label: "Student ID" },
        { key: "department", label: "Department" },
        { key: "year", label: "Year" },
        { key: "phone", label: "Phone Number", icon: Phone }
      );
    }
    if (role === "delivery") {
      base.push({ key: "deliveryId", label: "Delivery ID" }, { key: "phone", label: "Phone Number", icon: Phone });
    }
    if (role === "admin") base.push({ key: "adminId", label: "Admin ID" });
    return base;
  }, [role]);

  const validate = () => {
    const next = {};
    const required = ["fullName", "email", "password", "confirmPassword"];
    if (role === "student") required.push("studentId", "department", "year", "phone");
    if (role === "delivery") required.push("deliveryId", "phone");
    if (role === "admin") required.push("adminId");

    required.forEach((key) => {
      if (!String(form[key] || "").trim()) next[key] = "This field is required";
    });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address";
    if ((role === "student" || role === "delivery") && form.email && !form.email.toLowerCase().endsWith("@gmail.com")) next.email = "Only Gmail accounts are allowed";
    if (role === "admin" && form.email && form.email.toLowerCase() !== AUTHORIZED_ADMIN_EMAIL) next.email = "Only authorized admin email allowed";
    if (form.password && form.password.length < 6) next.password = "Password must be at least 6 characters";
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match";
    if ((role === "student" || role === "delivery") && form.phone && !/^\d{10}$/.test(form.phone)) next.phone = "Phone number must be 10 digits";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      role,
    };
    if (role === "student") {
      payload.phone = form.phone.trim();
      payload.studentId = form.studentId.trim();
      payload.department = form.department.trim();
      payload.year = form.year.trim();
    }
    if (role === "delivery") {
      payload.phone = form.phone.trim();
      payload.deliveryId = form.deliveryId.trim();
    }
    if (role === "admin") payload.adminId = form.adminId.trim();

    const result = await register(payload);
    setSubmitting(false);

    if (!result.ok) {
      showToast(result.message || "Registration failed", "error");
      const field = result.field || backendFieldMap[result.message];
      setErrors(field ? { [field]: result.message } : { form: result.message || "Registration failed" });
      return;
    }

    if (result.requiresLogin) {
      showToast("Account created. Please login.");
      navigate("/login");
      return;
    }
    if (result.requiresVerification) {
      navigate("/verify-account", {
        replace: true,
        state: {
          email: payload.email,
          phone: payload.phone || "",
          role,
          emailMessage: result.data?.emailMessage,
        },
      });
      return;
    }

    showToast("Account created successfully");
    navigate(redirectFor[role], { replace: true });
  };

  const passwordType = showPassword ? "text" : "password";

  return (
    <div className="auth-dark relative -mt-24 min-h-[calc(100vh+6rem)] overflow-hidden bg-[#111016] px-4 pb-16 pt-32 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(249,115,22,.24),transparent_32%),radial-gradient(circle_at_82%_10%,rgba(161,98,7,.2),transparent_30%),linear-gradient(135deg,#111016_0%,#1a171f_48%,#24160d_100%)]" />
      <div className="absolute left-8 top-32 h-32 w-32 rounded-full bg-orangeWarm/10 blur-3xl" />
      <div className="absolute bottom-16 right-10 h-40 w-40 rounded-full bg-caramel/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-[#121119] shadow-[0_30px_90px_rgba(0,0,0,.45)] lg:grid-cols-[.86fr_1fr]">
        <aside className="relative hidden min-h-[720px] overflow-hidden bg-[#0d0c12] p-8 lg:block">
          <div className="relative z-10 flex items-center justify-between">
            <Link to="/" className="text-2xl font-black tracking-wide text-orangeWarm">ROOMBITES</Link>
            <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-bold text-orange-50 transition hover:bg-white/14">
              Back to website <ArrowRight size={15} />
            </Link>
          </div>
          <div className="relative z-10 mt-8 h-[550px] overflow-hidden rounded-[1.6rem] border border-white/10">
            <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80" alt="RoomBites food delivery" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-3xl font-black leading-tight text-white">Create your campus food account</p>
            <p className="mt-3 max-w-sm text-orange-50">Use a real Gmail account. Admin access is restricted to the authorized RoomBites owner.</p>
            </div>
          </div>
        </aside>

        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8 flex items-center justify-between gap-4 lg:hidden">
            <Link to="/" className="text-2xl font-black text-orangeWarm">ROOMBITES</Link>
            <Link to="/" className="rounded-full bg-white/8 px-4 py-2 text-sm font-bold text-orange-50">Back</Link>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">Create your RoomBites account</h1>
            <p className="mt-3 text-[#D6C6B8]">
              Already have an account?{" "}
              <Link className="font-bold text-orange-200 underline underline-offset-4" to="/login">
                Login
              </Link>
            </p>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {Object.entries(roles).map(([key, item]) => {
              const Icon = item.icon;
              const selected = role === key;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => {
                    setRole(key);
                    setErrors({});
                  }}
                  className={`group rounded-2xl border p-4 text-left transition ${selected ? "border-[#F97316] bg-[#F97316] text-white shadow-[0_18px_35px_rgba(249,115,22,.28)]" : "border-white/15 bg-[#1F1D27] text-[#FFF7ED] hover:border-[#F97316]/80 hover:bg-[#282532]"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`grid h-10 w-10 place-items-center rounded-xl ${selected ? "bg-white/20 text-white" : "bg-black/25 text-orange-200"}`}>
                      <Icon size={19} />
                    </span>
                    <span className="font-black text-inherit">{item.label}</span>
                  </div>
                  <p className={`mt-3 text-xs font-medium leading-relaxed ${selected ? "text-white" : "text-[#D6C6B8]"}`}>{item.text}</p>
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} noValidate className="mt-7 grid gap-4 md:grid-cols-2">
            {fields.map((field) => (
              <DarkInput
                key={`${role}-${field.key}`}
                icon={field.icon}
                type={field.type || "text"}
                label={field.label}
                value={form[field.key]}
                error={errors[field.key]}
                onChange={(event) => update(field.key, event.target.value)}
              />
            ))}

            <PasswordInput
              icon={Lock}
              label="Password"
              type={passwordType}
              value={form.password}
              error={errors.password}
              onChange={(event) => update("password", event.target.value)}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
            <DarkInput
              icon={Lock}
              type={passwordType}
              label="Confirm Password"
              value={form.confirmPassword}
              error={errors.confirmPassword}
              onChange={(event) => update("confirmPassword", event.target.value)}
            />

            {errors.form && <p className="rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm font-bold text-red-200 md:col-span-2">{errors.form}</p>}

            <button
              className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#A16207] px-6 py-4 text-lg font-black text-white shadow-[0_18px_35px_rgba(249,115,22,.34)] transition hover:-translate-y-0.5 hover:from-[#EA580C] hover:to-[#854D0E] disabled:cursor-not-allowed disabled:opacity-70"
              type="submit"
              disabled={submitting}
            >
              {submitting && <Loader2 className="animate-spin" size={20} />}
              {submitting ? "Creating account..." : `Register as ${roles[role].label}`}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

function DarkInput({ icon: Icon, label, error, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-bold text-orange-50">{label}</span>
      <span className="relative block">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D6C6B8]" size={18} />}
        <input
          className={`w-full rounded-2xl border bg-white/[.07] px-5 py-4 text-white outline-none transition placeholder:text-[#BFA995] focus:border-orangeWarm focus:bg-white/[.1] focus:ring-4 focus:ring-orangeWarm/10 ${Icon ? "pl-12" : ""} ${error ? "border-red-400" : "border-white/15"}`}
          placeholder={label}
          {...props}
        />
      </span>
      {error && <span className="mt-2 block text-sm font-semibold text-red-200">{error}</span>}
    </label>
  );
}

function PasswordInput({ showPassword, setShowPassword, ...props }) {
  return (
    <div className="relative">
      <DarkInput {...props} />
      <button type="button" className="absolute right-4 top-[43px] text-[#D6C6B8] transition hover:text-white" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
