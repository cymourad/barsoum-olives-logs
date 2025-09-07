/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#f7f8f0',
          100: '#eef0de',
          200: '#dde2c0',
          300: '#c6cf99',
          400: '#b0bc74',
          500: '#9ba355',
          600: '#7a8142',
          700: '#5e6336',
          800: '#4d502e',
          900: '#424429',
        }
      }
    },
  },
  plugins: [],
}
