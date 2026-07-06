/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Atkinson Hyperlegible"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Warm, calm parchment palette
        sand: {
          50: '#fdfaf3',
          100: '#f7f3ea',
          200: '#eee6d3',
          300: '#e2d6b8',
          400: '#c9b893',
          500: '#a8946a',
        },
        ink: {
          900: '#2b2b35',
          700: '#4a4a59',
          500: '#6b6b7b',
          300: '#a9a9b8',
        },
        sea: {
          50: '#eef7f6',
          100: '#d6ece9',
          200: '#a9d8d2',
          300: '#7cc0b7',
          400: '#54a89c',
          500: '#2f8c80',
          600: '#1f6b62',
        },
        coral: {
          50: '#fdeeea',
          100: '#f9d8cc',
          200: '#f1ad95',
          300: '#e8825f',
          400: '#d86440',
          500: '#b94f30',
        },
        sun: {
          50: '#fff6e0',
          100: '#ffe9b3',
          200: '#fdd483',
          300: '#f5b94f',
          400: '#e0a026',
        },
        rose: {
          50: '#fdeef2',
          100: '#f9d4dd',
          200: '#f1a9bd',
          300: '#e87e9b',
          400: '#d35c7c',
        },
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        soft: '0 2px 10px -2px rgba(43, 43, 53, 0.08), 0 8px 24px -8px rgba(43, 43, 53, 0.12)',
        'soft-lg': '0 4px 16px -4px rgba(43, 43, 53, 0.10), 0 16px 40px -12px rgba(43, 43, 53, 0.18)',
        glow: '0 0 0 4px rgba(47, 140, 128, 0.18)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pop': {
          '0%': { transform: 'scale(0.96)' },
          '60%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        'bar-grow': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        pop: 'pop 0.3s ease-out both',
        wiggle: 'wiggle 0.5s ease-in-out',
        'bar-grow': 'bar-grow 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
