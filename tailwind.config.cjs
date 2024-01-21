/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        '128': '32rem', // 512px
        '144': '36rem', // 576px
      }
    },
  },
  plugins: [],
};

module.exports = config;
