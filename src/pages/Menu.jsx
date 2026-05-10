import { CategoryCard } from "../components/ui";
import { useApp } from "../context/AppContext";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const page = "mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8";

function SectionTitle({ eyebrow, title, text }) {
  return (
    <div className="mb-8 max-w-3xl">
      <p className="font-black uppercase tracking-wide text-caramel">{eyebrow}</p>
      <h1 className="mt-2 text-4xl font-black text-coffee md:text-5xl">{title}</h1>
      {text && <p className="mt-4 text-lg text-muted">{text}</p>}
    </div>
  );
}

export default function Menu() {
  const { categories, cartCount, cartSubtotal, currentUser, money, fetchCategories, showToast } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    fetchCategories()
      .catch(() => {
        if (alive) {
          setError("Backend server not reachable. Please start backend on port 5001.");
          showToast("Backend server not reachable. Please start backend on port 5001.", "error");
        }
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [fetchCategories, showToast]);

  if (currentUser?.role === "delivery") return <Navigate to="/delivery-dashboard" replace />;
  if (currentUser?.role === "admin") return <Navigate to="/admin-dashboard" replace />;

  return (
    <div className={page}>
      <SectionTitle
        eyebrow="Menu"
        title="20 campus food categories"
        text="Click any category card to browse its RoomBites items."
      />
      {currentUser?.role === "student" && (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-coffee p-5 text-white shadow-premium">
          <div>
            <p className="text-sm font-bold text-orange-100">Current cart</p>
            <h2 className="text-2xl font-black">{cartCount} items · {money(cartSubtotal)}</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/cart" className="rounded-xl bg-white/15 px-5 py-3 font-black transition hover:bg-white/25">View Cart</Link>
            <Link to="/checkout" className="rounded-xl bg-orangeWarm px-5 py-3 font-black text-white transition hover:bg-caramel">Proceed to Checkout</Link>
          </div>
        </div>
      )}
      {error && <div className="mb-6 rounded-2xl bg-red-50 p-4 font-bold text-danger">{error}</div>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-2xl bg-orange-100" />) : categories.map((category) => (
          <CategoryCard key={category.slug || category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
