/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#ffbad0",
          dark: "#0056b3",
        },
        secondary: {
          DEFAULT: "#f8c076",
          dark: "#cc7a00",
        },
        accent: {
          DEFAULT: "#4bd08b",
          dark: "#1e7e34",
        },
        background: {
          light: "#f2f6fa",
          DEFAULT: "#F1F3F5",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
