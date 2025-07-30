// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          inter: ['Inter', 'sans-serif']
        },
        fontWeight: {
          'inter-bold': '700',
          'inter-extrabold': '800',
          'inter-black': '900',
        }
      },
    },
    plugins: [],
  }