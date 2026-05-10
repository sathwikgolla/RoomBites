export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        coffee: "#3B2416",
        chocolate: "#5C3A21",
        caramel: "#A16207",
        orangeWarm: "#F97316",
        cream: "#FFF7ED",
        beige: "#FEF3C7",
        textDark: "#1C1917",
        muted: "#5C3A21",
        success: "#22C55E",
        danger: "#EF4444",
      },
      boxShadow: {
        premium: "0 20px 60px rgba(59,36,22,.18)",
        glass: "0 14px 38px rgba(59,36,22,.16)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
