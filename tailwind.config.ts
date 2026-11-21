import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./clothing.html",
    "./fragrance.html",
    "./journal.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#050505",
        cream: "#ebded8",
        signal: "#d91b16",
        product: "#eeeae7",
        line: "#bfb0aa",
        surface: "#e0d0c8",
        focus: "#ab1513",
        accent: "#bb1815",
      },
      fontFamily: {
        manrope: ["'Manrope Variable'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
