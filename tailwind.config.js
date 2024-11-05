/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}', // All pages
    './components/**/*.{js,ts,jsx,tsx}', // All components
    './app/**/*.{js,ts,jsx,tsx}', // If you are using the app directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
