/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#242424",
        "light-bg": "#FEFEFF",
        "dark-blue": "#0155A3",
        "primary-white": "#FDFEFE",
        "light-gray": "#B1BCDA",
        "black-900": "#060B13",
        "gray-450": "#5F6874",
        "gray-750": "#3E4A5D",
        "light-blue": "#296FD2",
        "success": "#6BAA75",
      },
    },
  },
  plugins: [],
}

