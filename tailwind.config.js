/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./resources/views/**/*.blade.php",
    "./resources/js/**/*.{js,jsx,ts,tsx,vue}",
  ],
  darkMode: 'class', // or 'media' or 'boolean'
  theme: {
    extend: {},
  },
  plugins: [],
}
