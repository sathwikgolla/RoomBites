import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function FloatingCheckoutButton() {
  const { currentUser, cartCount, cartSubtotal, money } = useApp();
  const canShow = currentUser?.role === "student" && cartCount > 0;

  return (
    <AnimatePresence>
      {canShow && (
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-6 sm:w-auto"
        >
          <Link
            to="/checkout"
            className="flex items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#5C3A21] to-[#A16207] px-5 py-4 font-black text-white shadow-2xl shadow-[#5C3A21]/30 ring-4 ring-orangeWarm/20 transition hover:-translate-y-1"
          >
            <span className="flex items-center gap-3 text-white">
              <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-white/15 text-white">
                <ShoppingCart size={21} />
                <span className="absolute -right-1 -top-1 rounded-full bg-orangeWarm px-1.5 text-[10px] font-bold text-white">{cartCount}</span>
              </span>
              <span className="text-white">{cartCount} items • {money(cartSubtotal)}</span>
            </span>
            <span className="rounded-xl border border-white/40 bg-white px-4 py-2 text-sm font-black text-[#5C3A21] shadow-lg">
              Checkout Now
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
