import { motion } from "framer-motion";
import { Clock, CreditCard, Flame, PackageCheck, ShieldCheck, Sparkles, Truck, UserRound, Utensils, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { CategoryCard } from "../components/ui";
import { useApp } from "../context/AppContext";

const section = "mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8";

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ eyebrow, title, text, center = false }) {
  return (
    <Reveal>
      <div className={`mb-10 ${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
        <p className="font-black uppercase tracking-wide text-caramel">{eyebrow}</p>
        <h2 className="mt-2 text-4xl font-black text-stone-950 md:text-5xl">{title}</h2>
        {text && <p className="mt-4 text-lg font-medium text-chocolate">{text}</p>}
      </div>
    </Reveal>
  );
}

function InfoCard({ icon: Icon, title, text, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div className="h-full rounded-2xl border border-[#D6A85A]/40 bg-[#FFFDF8] p-6 shadow-xl shadow-[#5C3A21]/10">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#5C3A21] text-white">
          <Icon size={22} />
        </div>
        <h3 className="mt-5 text-xl font-black text-stone-950">{title}</h3>
        <p className="mt-2 font-medium text-chocolate">{text}</p>
      </div>
    </Reveal>
  );
}

export default function Home() {
  const { categories } = useApp();
  const featured = ["chicken", "biryani", "noodles", "soft-drinks", "ice-creams", "combo-offers"];
  const featuredCategories = categories.filter((item) => featured.includes(item.slug || item.id));

  return (
    <div className="-mt-24">
      <section className="relative overflow-hidden brown-gradient px-4 pb-20 pt-36 text-white">
        <div className="absolute inset-0 opacity-25 cream-grid" />
        {["Chicken 65", "Cold Coffee", "Biryani Bowl", "Masala Dosa"].map((name, index) => (
          <motion.div
            key={name}
            animate={{ y: [0, -18, 0], rotate: [0, index % 2 ? 4 : -4, 0] }}
            transition={{ repeat: Infinity, duration: 4 + index, ease: "easeInOut" }}
            className={`dark-glass absolute hidden rounded-2xl px-5 py-4 font-black text-white lg:block ${index === 0 ? "left-10 top-44" : index === 1 ? "right-10 top-40" : index === 2 ? "bottom-24 left-1/4" : "bottom-24 right-1/4"}`}
          >
            {name}
          </motion.div>
        ))}
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.08fr_.92fr]">
          <Reveal>
            <div>
              <p className="inline-flex rounded-full bg-white/15 px-4 py-2 font-bold text-orange-100">Premium campus delivery</p>
              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight text-white md:text-7xl">Campus Food Delivered To Your Room</h1>
              <p className="mt-6 max-w-2xl text-xl font-medium text-orange-50">Order from your college canteen and receive food at your classroom, floor, or hostel block.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/menu" className="rounded-xl bg-white px-6 py-3 font-black text-coffee transition hover:-translate-y-0.5">Explore Menu</Link>
                <Link to="/login" className="rounded-xl bg-orangeWarm px-6 py-3 font-black text-white transition hover:-translate-y-0.5 hover:bg-orange-600">Login to Order</Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative rounded-[2rem] border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur">
              <img className="h-[520px] w-full rounded-[1.5rem] object-cover" src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80" alt="RoomBites campus food" />
              <div className="absolute bottom-8 left-8 right-8 rounded-2xl bg-[#FFFDF8]/92 p-5 text-coffee backdrop-blur">
                <p className="text-sm font-bold text-caramel">Fast checkout</p>
                <p className="text-2xl font-black text-stone-950">Add food and checkout appears instantly</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={section}>
        <div className="grid gap-6 md:grid-cols-4">
          {[
            ["500+ Orders Demo", PackageCheck],
            ["20+ Food Categories", Utensils],
            ["15 Min Delivery", Clock],
            ["₹1,00,000 Demo Wallet", Wallet],
          ].map(([label, Icon], index) => (
            <InfoCard key={label} icon={Icon} title={label} text="Built into the RoomBites ordering experience." delay={index * 0.04} />
          ))}
        </div>
      </section>

      <section className={section}>
        <SectionTitle eyebrow="How it works" title="From canteen craving to room delivery in four steps." text="RoomBites keeps ordering simple for students and operationally clear for delivery boys and admins." center />
        <div className="grid gap-6 md:grid-cols-4">
          {[
            ["Login/Register", UserRound, "Create a student account with a RoomBites wallet."],
            ["Choose Food", Utensils, "Browse 20 categories and add items instantly."],
            ["Select Floor & Room", PackageCheck, "Enter classroom, floor, department, and note."],
            ["Get Delivered", Truck, "Track acceptance, delivery, and confirmation."],
          ].map(([title, Icon, text], index) => <InfoCard key={title} icon={Icon} title={title} text={text} delay={index * 0.05} />)}
        </div>
      </section>

      <section className={`${section} rounded-[2rem]`}>
        <SectionTitle eyebrow="Why choose us" title="Designed for real campus break-time problems." />
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Avoid long canteen queues", Sparkles],
            ["Save break time", Clock],
            ["Helpful during summer", Flame],
            ["Room/floor delivery", Truck],
            ["Speed delivery options", PackageCheck],
            ["Demo wallet payment", CreditCard],
          ].map(([title, Icon], index) => <InfoCard key={title} icon={Icon} title={title} text="A smoother campus food workflow with clear status and payment simulation." delay={index * 0.04} />)}
        </div>
      </section>

      <section className={section}>
        <SectionTitle eyebrow="Featured" title="Popular RoomBites categories" text="Start with the highest-demand campus favorites." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCategories.map((category) => <CategoryCard key={category.slug} category={category} />)}
        </div>
      </section>

      <section className={section}>
        <div className="brown-gradient rounded-[2rem] p-6 text-white shadow-2xl md:p-10">
          <Reveal>
            <div className="mb-10 max-w-3xl">
              <p className="font-black uppercase tracking-wide text-orange-100">Speed delivery</p>
              <h2 className="mt-2 text-4xl font-black text-white md:text-5xl">Choose how fast your order should arrive.</h2>
              <p className="mt-4 text-lg font-medium text-orange-50">Premium speed options dynamically update checkout totals.</p>
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-4">
            {["5 min delivery: ₹30 extra", "10 min delivery: ₹20 extra", "15 min delivery: ₹10 extra", "20 min delivery: Free"].map((item) => (
              <div key={item} className="rounded-2xl bg-white/12 p-5 font-black text-white backdrop-blur">{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section className={section}>
        <SectionTitle eyebrow="Roles" title="One frontend, three clean experiences." center />
        <div className="grid gap-6 md:grid-cols-3">
          <InfoCard icon={UserRound} title="Student" text="Place orders, pay with RoomBites wallet, track status, and confirm receipt." />
          <InfoCard icon={Truck} title="Delivery Boy" text="Accept pending orders, mark out for delivery, and confirm completion." delay={0.05} />
          <InfoCard icon={ShieldCheck} title="Admin" text="Review users, orders, statuses, wallet balances, and platform revenue." delay={0.1} />
        </div>
      </section>

      <section className={section}>
        <div className="rounded-[2rem] border border-[#D6A85A]/40 bg-[#FFFDF8] p-8 text-center shadow-xl shadow-[#5C3A21]/10 md:p-12">
          <h2 className="text-4xl font-black text-stone-950 md:text-5xl">Ready to skip the queue?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-chocolate">Register as a student, add food, and watch the checkout panel appear as your cart grows.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="rounded-xl primary-btn px-6 py-3 font-black transition hover:-translate-y-0.5">Register Now</Link>
            <Link to="/menu" className="rounded-xl light-btn px-6 py-3 font-black transition hover:-translate-y-0.5">View Menu</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
