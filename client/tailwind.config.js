/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dce8ff',
          500: '#3b6cf6',
          600: '#2f56e0',
          700: '#2645b8',
        },
      },
    },
  },
  plugins: [],
};