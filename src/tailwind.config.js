/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.js"
  ],

  theme: {
    extend: {
      colors: {
        primary: "#173458",
        secondary: "#0D5BD7",
      },
    },
  },

  plugins: [
    require('flowbite/plugin')
  ],
}