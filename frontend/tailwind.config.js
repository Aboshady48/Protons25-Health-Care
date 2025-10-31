/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#93da97',
        background: '#3e5f44',
        accent: '#ffffff',
        // Add more from your theme if needed
      },
      animation: {
        fadeOrb: 'fadeOrb 25s ease-in-out infinite alternate',
        fadePattern: 'fadePattern 40s ease-in-out infinite alternate',
        floaty: 'floaty 10s linear infinite',
        // Add more from your existing keyframes
      },
      keyframes: {
        fadeOrb: {
          from: { opacity: 0.05, transform: 'scale(1)' },
          to: { opacity: 0.15, transform: 'scale(1.05)' },
        },
        fadePattern: {
          from: { opacity: 0.05, transform: 'rotate(0deg)' },
          to: { opacity: 0.12, transform: 'rotate(5deg)' },
        },
        floaty: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: 0.2 },
          '50%': { transform: 'translateY(-20px) rotate(180deg)', opacity: 0.4 },
          '100%': { transform: 'translateY(0) rotate(360deg)', opacity: 0.2 },
        },
      },
    },
  },
  plugins: [],
}