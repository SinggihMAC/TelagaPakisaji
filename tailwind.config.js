/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0A2463', // Biru dongker
          light: '#1D3E8C',
          dark: '#071A4A',
        },
        secondary: {
          DEFAULT: '#247BA0',
          light: '#2D97C4',
          dark: '#1B5F7C',
        },
        accent: {
          DEFAULT: '#E8F1F2',
          dark: '#C5D1D3',
        },
      },
    },
  },
  plugins: [],
}