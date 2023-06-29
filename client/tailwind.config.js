/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgGray: "#E8E9EB",
        cardLavender: '#B8C1EC',
      },
    },
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
      oxygen: ["OXYGEN", "sans-serif"],
      viga: ["VIGA", "sans-serif"],
    },
  },
  plugins: [],
};
