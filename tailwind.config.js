/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./website/**/*.{html,js}",
    "./website/assets/**/*.js",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        accent: '#669BD2',
        light: '#FAFAFA',
        neon: '#CCFF00',
        brandOrange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          500: '#F97316',
          600: '#EA580C',
          DEFAULT: '#FF5500',
          hover: '#E04B00',
          dark: '#C2410C',
        },
        safety: '#EAB308',
        industrial: '#111827',
        concrete: '#F3F4F6',
      },
    },
  },
  plugins: [],
};
