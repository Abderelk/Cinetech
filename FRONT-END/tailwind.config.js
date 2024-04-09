/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    borderRadius: {
      md: "15px"
    },
    textColor: {
      'red': 'rgb(229, 8, 21)',
      'white': '#f9f9f9',
      'black': '#111',
    },
    backgroundColor: {
      'red': 'rgb(229, 8, 21)',
      'white': '#f9f9f9',
      'black': '#111',
    },
    borderColor: {
      'black': '#111',
      'red': 'rgb(229, 8, 21)',
      'white': '#f9f9f9',
    }

  },
  plugins: [],
}