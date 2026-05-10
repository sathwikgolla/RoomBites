import FloatingCheckoutButton from "./components/FloatingCheckoutButton.jsx";
import Navbar from "./components/Navbar.jsx";
import { Footer, Toast } from "./components/ui";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen cream-grid">
      <Navbar />
      {children}
      <Footer />
      <FloatingCheckoutButton />
      <Toast />
    </div>
  );
}
