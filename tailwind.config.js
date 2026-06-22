/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#615FFF', dark: '#3d3bcc', light: '#9b8fff' },
        surface: { DEFAULT: '#0d1117', card: '#12151f' },
        gold: { DEFAULT: '#c8a800', light: '#ffe066' },
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif'],
      },
    }
  },
  plugins: []
}
