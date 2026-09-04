import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#FBFBFA",
        surface: "#FFFFFF",
        ink: { DEFAULT: "#171511", soft: "#6C685F" },
        accent: { DEFAULT: "#0A5CFF", ink: "#FBFBFA" },
        amber: { DEFAULT: "#8F5B08", bg: "#FBF1DF" },
        emerald: { DEFAULT: "#0F7A4B", bg: "#E6F5EC" },
        hairline: "rgba(10,10,8,0.08)",
        "hairline-strong": "rgba(10,10,8,0.16)",
      },
      fontFamily: {
        display: ["var(--font-instrument-serif)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: { measure: "62ch" },
      boxShadow: {
        e1: "0 1px 2px rgba(23,21,17,0.06), 0 2px 6px -1px rgba(23,21,17,0.05)",
        e2: "0 2px 4px rgba(23,21,17,0.06), 0 10px 22px -6px rgba(23,21,17,0.09)",
      },
      borderRadius: { sm: "6px", md: "12px", lg: "20px" },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: { ticker: "ticker 34s linear infinite" },
    },
  },
  plugins: [],
};

export default config;
