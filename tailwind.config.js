/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addVariant }) {
      // Define the `dark` variant used by the stylesheet. This reproduces
      // the previous `@custom-variant dark (&:is(.dark *));` behaviour.
      addVariant('dark', '&:is(.dark *)');
    },
  ],
};
