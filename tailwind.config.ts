import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-outer": "#EDEFF2",
        "canvas-bg": "#FAFAF7",
        "card-bg": "#FFFFFF",
        "text-main": "#1F2937",
        "text-muted": "#6B7280",
        "border-soft": "#CBD5E1",
        "border-strong": "#94A3B8",
        navy: "#1E3A5F",
        blue: "#2563EB",
        teal: "#0F766E",
        amber: "#D97706",
        slate2: "#475569",
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "Times", "serif"],
        serifTC: ["Songti TC", "PMingLiU", "Songti SC", "serif"],
        mono: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Arial", "sans-serif"],
      },
      boxShadow: {
        card: "0 12px 32px rgba(15, 23, 42, 0.08)",
        "card-hover": "0 16px 40px rgba(30, 58, 95, 0.18)",
      },
    },
  },
  plugins: [],
} satisfies Config;
