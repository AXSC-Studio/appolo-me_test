/** @type {import('tailwindcss').Config} */
export default {
  content: ["./apps/web/index.html", "./apps/web/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-orange": "var(--color-brand-orange, #FF7E47)",
        "brand-dark": "var(--color-brand-dark, #1A1A2E)",
        "brand-light": "var(--color-brand-light, #F8F9FA)",
        "brand-accent": "var(--color-brand-accent, #FFF4EF)",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
