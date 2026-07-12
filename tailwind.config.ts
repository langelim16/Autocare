import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Oswald", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        gray: {
          50: "#f7f2e9",
          100: "#ece2d0",
          200: "#c9bda3",
          300: "#a5906f",
          400: "#8a7a5c",
          500: "#6f5f48",
          600: "#4d3f2e",
          700: "#3a2f22",
          800: "#2e251b",
          900: "#211a13",
          950: "#16120d",
        },
        brand: { 50: "#f7ecd3", 400: "#e2c584", 500: "#c9a962", 600: "#a8894c" },
        surface: { DEFAULT: "#211a13", hover: "#2e251b", border: "#3a2f22" },
        seal: { gold: "#c9a962", silver: "#9aa7b1", bronze: "#b87745" },
      },
      animation: { "fade-in": "fadeIn 0.5s ease-out", "slide-up": "slideUp 0.5s ease-out" },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
