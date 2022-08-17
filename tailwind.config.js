/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './app/components/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite-react/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#818cf8',
        disabled: '#a5b4fc',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('flowbite/plugin'),
  ],
};
