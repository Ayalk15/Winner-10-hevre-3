/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        premium: '0 20px 60px rgba(0,0,0,0.45)',
      },
      backgroundImage: {
        stadium: 'radial-gradient(circle at top right, rgba(245,158,11,.23), transparent 32%), radial-gradient(circle at bottom left, rgba(16,185,129,.16), transparent 28%), linear-gradient(180deg,#020617 0%,#07111f 48%,#020617 100%)',
      }
    },
  },
  plugins: [],
}
