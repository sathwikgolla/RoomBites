import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function VerifyAccount() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sendEmailOtp, verifyEmailOtp, showToast } = useApp();
  const queryEmail = new URLSearchParams(location.search).get("email");
  const [email, setEmail] = useState(location.state?.email || queryEmail || "");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [loading, setLoading] = useState("");
  const [message, setMessage] = useState({
    email: location.state?.emailMessage || "",
  });

  const run = async (key, action) => {
    try {
      setLoading(key);
      const data = await action();
      showToast(data.message || "Updated");
      return data;
    } catch (error) {
      const text = error?.response?.data?.message || error.message || "Verification failed";
      showToast(text, "error");
      setMessage((current) => ({ ...current, email: text }));
      return null;
    } finally {
      setLoading("");
    }
  };

  const verifyEmail = async () => {
    const data = await run("emailVerify", () => verifyEmailOtp(email, emailOtp));
    if (data?.emailVerified || data?.token) {
      setEmailVerified(true);
      if (data.token) {
        const role = data.user?.role;
        navigate(role === "delivery" ? "/delivery-dashboard" : role === "admin" ? "/admin-dashboard" : "/dashboard", { replace: true });
      }
    }
  };

  return (
    <div className="auth-dark relative -mt-24 min-h-[calc(100vh+6rem)] overflow-hidden bg-[#111016] px-4 pb-16 pt-32 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(249,115,22,.24),transparent_32%),radial-gradient(circle_at_82%_10%,rgba(161,98,7,.2),transparent_30%),linear-gradient(135deg,#111016_0%,#1a171f_48%,#24160d_100%)]" />
      <div className="relative mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-[#121119]/95 p-6 shadow-[0_30px_90px_rgba(0,0,0,.45)] sm:p-10">
        <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-bold text-orange-50 transition hover:bg-white/14">
          Back to website <ArrowRight size={15} />
        </Link>
        <h1 className="mt-8 text-4xl font-black text-white md:text-5xl">Verify your RoomBites account</h1>
        <p className="mt-3 text-[#D6C6B8]">You can login only after your Gmail OTP is verified.</p>

        <div className="mt-8 grid gap-5">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-orange-50">Registered Gmail</span>
            <input
              className="w-full rounded-2xl border border-white/15 bg-white/[.08] px-5 py-4 text-white outline-none placeholder:text-[#BFA995] focus:border-orangeWarm"
              placeholder="you@gmail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value.trim().toLowerCase())}
            />
          </label>
          <VerifyPanel
            icon={Mail}
            title="Email verification"
            target={email || "Enter your registered email"}
            verified={emailVerified}
            otp={emailOtp}
            setOtp={setEmailOtp}
            message={message.email}
            onVerify={verifyEmail}
            onResend={() => run("emailResend", () => sendEmailOtp(email))}
            loading={loading}
            verifyKey="emailVerify"
            resendKey="emailResend"
          />
        </div>

        <button
          disabled={!emailVerified}
          onClick={() => navigate("/login", { replace: true })}
          className="mt-8 w-full rounded-2xl bg-gradient-to-r from-[#F97316] to-[#A16207] px-6 py-4 text-lg font-black text-white shadow-[0_18px_35px_rgba(249,115,22,.34)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue to Login
        </button>
      </div>
    </div>
  );
}

function VerifyPanel({ icon: Icon, title, target, verified, otp, setOtp, message, onVerify, onResend, loading, verifyKey, resendKey }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-white/[.07] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-orangeWarm/20 text-orange-200"><Icon /></span>
          <div>
            <h2 className="text-xl font-black text-white">{title}</h2>
            <p className="text-sm font-semibold text-[#D6C6B8]">{target}</p>
            {message && <p className="mt-2 text-sm font-bold text-orange-100">{message}</p>}
          </div>
        </div>
        {verified && <span className="inline-flex items-center gap-2 rounded-full bg-green-500/15 px-3 py-1 text-sm font-black text-green-200"><CheckCircle2 size={16} /> Verified</span>}
      </div>
      {!verified && (
        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <input className="rounded-2xl border border-white/15 bg-white/[.08] px-5 py-4 text-white outline-none placeholder:text-[#BFA995] focus:border-orangeWarm" placeholder="Enter 6 digit OTP" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))} />
          <button onClick={onVerify} disabled={loading === verifyKey || otp.length !== 6} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orangeWarm px-5 py-3 font-black text-white disabled:opacity-50">
            {loading === verifyKey && <Loader2 className="animate-spin" size={18} />} Verify
          </button>
          <button onClick={onResend} disabled={loading === resendKey} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[.08] px-5 py-3 font-black text-white disabled:opacity-50">
            {loading === resendKey && <Loader2 className="animate-spin" size={18} />} Resend
          </button>
        </div>
      )}
    </motion.div>
  );
}
