/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./index.html",
    "./node_modules/@angular/material/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#ffbad0",
          dark: "#83a6ce ",
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
        customPurple: {
          light: "#E5C9D7",
          bold: "#AE7DAC",
          DEFAULT: "#C48CB3",
        },
        edit: {
          DEFAULT: "#ED9E59",
        }
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
