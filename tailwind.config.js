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
          DEFAULT: '#00F7B1',
          dark: '#00C58E',
          light: '#33F9C1',
        },
        secondary: '#1A1D1F',
        background: {
          dark: '#0A0B0C',
          DEFAULT: '#111315',
          light: '#1A1D1F',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#9BA1A9',
          muted: '#6F767E',
        },
        border: '#2A2F34',
        success: '#00F7B1',
        error: '#FF6B6B',
        warning: '#FFB84D',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}