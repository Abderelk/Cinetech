/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    borderRadius: {
      md: "15px",
    },
    textColor: {
      red: "rgb(229, 8, 21)",
      white: "#f9f9f9",
      black: "#111",
    },
    backgroundColor: {
      red: "rgb(229, 8, 21)",
      white: "#f9f9f9",
      black: "#111",
      gray: "#9B9B9B",
    },
    borderColor: {
      black: "#111",
      red: "rgb(229, 8, 21)",
      white: "#f9f9f9",
      green: "#4CAF50",
      yellow: "#FFCE00",
    },
    minHeight: {
      screen: "80vh",
    },
  },
  plugins: [],
};
