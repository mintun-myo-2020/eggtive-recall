/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        offwhite: "#FEF6E4",
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
