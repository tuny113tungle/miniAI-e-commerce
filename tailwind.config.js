/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary-100': 'var(--color-primary-100)',
      }
    },
  },
  plugins: [],
};
