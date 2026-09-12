/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bastar: {
          950: '#070a12',
          900: '#0d1322',
          800: '#151f38',
          accent: '#f59e0b',
          hotdrop: '#ff4d2e'
        }
      }
    },
  },
  plugins: [],
}
