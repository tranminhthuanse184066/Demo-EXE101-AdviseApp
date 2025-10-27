/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#2563EB',
          soft: '#EFF6FF',
          dark: '#1D4ED8',
        },
      },
    },
  },
  plugins: [],
};
