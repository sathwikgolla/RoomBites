import { Link, Navigate, useParams } from "react-router-dom";
import { EmptyState, FoodItemCard } from "../components/ui";
import { useApp } from "../context/AppContext";
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

export default function CategoryItems() {
  const { categorySlug } = useParams();
  const { foodItems, currentUser, fetchFoodsByCategory, showToast } = useApp();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchFoodsByCategory(categorySlug)
      .then((data) => {
        if (alive) setCategory(data.category);
      })
      .catch(() => {
        if (alive) {
          setError("Backend server not reachable. Please start backend on port 5001.");
          showToast("Could not load category items", "error");
        }
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [categorySlug, fetchFoodsByCategory, showToast]);

  if (currentUser?.role === "delivery") return <Navigate to="/delivery-dashboard" replace />;
  if (currentUser?.role === "admin") return <Navigate to="/admin-dashboard" replace />;
  const items = foodItems;

  if (!loading && !category) {
    return (
      <div className={page}>
        <EmptyState title="Category not found" text="That RoomBites category is not available right now." />
        <div className="mt-6 text-center">
          <Link className="font-black text-caramel" to="/menu">
            Back to menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={page}>
      <SectionTitle
        eyebrow="Category"
        title={category ? `${category.name} Items` : "Loading Items"}
        text={category?.description}
      />
      {error && <div className="mb-6 rounded-2xl bg-red-50 p-4 font-bold text-danger">{error}</div>}
      {loading && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-96 animate-pulse rounded-2xl bg-orange-100" />)}</div>}
      {!loading && items.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <FoodItemCard key={item._id || item.id} item={item} />
          ))}
        </div>
      ) : !loading ? (
        <EmptyState title="No items found" text={`No ${category.name} items are available yet.`} />
      ) : null}
    </div>
  );
}
