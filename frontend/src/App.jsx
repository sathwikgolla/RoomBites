import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RoleBasedRoute from "./components/RoleBasedRoute.jsx";
import Layout from "./Layout.jsx";
import CategoryItems from "./pages/CategoryItems.jsx";
import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import Register from "./pages/Register.jsx";
import VerifyAccount from "./pages/VerifyAccount.jsx";
import {
  About,
  AdminDashboard,
  Cart,
  Checkout,
  DeliveryDashboard,
  Login,
  NotFound,
  Notifications,
  Orders,
  Profile,
  StudentDashboard,
} from "./pages";

export default function App() {
  const location = useLocation();
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.main key={location.pathname} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-account" element={<VerifyAccount />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route element={<RoleBasedRoute roles={["student"]} />}>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/student-dashboard" element={<StudentDashboard />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/menu/:categorySlug" element={<CategoryItems />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
            </Route>
            <Route element={<RoleBasedRoute roles={["delivery"]} />}>
              <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
              <Route path="/assigned-orders" element={<DeliveryDashboard />} />
            </Route>
            <Route element={<RoleBasedRoute roles={["admin"]} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminDashboard section="users" />} />
              <Route path="/admin/orders" element={<AdminDashboard section="orders" />} />
              <Route path="/admin/reports" element={<AdminDashboard section="reports" />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
    </Layout>
  );
}
