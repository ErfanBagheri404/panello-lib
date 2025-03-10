import animatePlugin from "tailwindcss-animate";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [animatePlugin],
};
