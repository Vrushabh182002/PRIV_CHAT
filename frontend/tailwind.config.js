/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        gridPulse: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.55" },
        },
        orbDrift: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "33%": { transform: "translate(120px, 60px)" },
          "66%": { transform: "translate(60px, 120px)" },
        },
      },
      animation: {
        "grid-pulse": "gridPulse 8s ease-in-out infinite",
        "orb-drift": "orbDrift 12s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
