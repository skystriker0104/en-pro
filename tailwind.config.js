/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      colors: {
        ngot: {
          terracotta: '#d85c38',
          'terracotta-dark': '#b94826',
          coral: '#e26f4c',
          cream: '#faf7f2',
          paper: '#fcfaf6',
          ink: '#262322',
        }
      },
      boxShadow: {
        'solid-sm': '2px 2px 0px #262322',
        'solid': '3px 3px 0px #262322',
        'solid-lg': '5px 5px 0px #262322',
      }
    },
  },
  plugins: [],
}
