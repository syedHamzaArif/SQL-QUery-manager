/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        md: "780px",
      },
    },
  },
  plugins: [require("daisyui"), require("tailwind-scrollbar")],
  daisyui:{
    themes:[
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          // primary: "blue",
          // "primary-focus": "mediumblue",
        },
        dark: {
          ...require("daisyui/src/colors/themes")["[data-theme=dark]"],
          // primary: "red",
          // "primary-focus": "mediumblue",
        },
      }
    ]
  },
  variants: {
    scrollbar: ["rounded"],
  },
};
