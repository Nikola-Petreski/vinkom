/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.{html,js}",          // all HTML/JS in root
    "./includes/**/*.{js,ts}" // all JS/TS in includes folder (recursive)
  ],
  theme: {
    extend: {
      fontFamily: {
        gidole: ["Gidole"],
      },
    },
    screens: {
      xs: "600px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",  
      "2xl": "1536px",
      "3xl": "1920px",
    },
  },
  plugins: [],
};