/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './_pages/**/*.{js,ts,jsx,tsx,mdx}',
    './_components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        royal_blue_traditional: {
          DEFAULT: '#11296b',
          100: '#030815',
          200: '#07102a',
          300: '#0a1840',
          400: '#0d2055',
          500: '#11296b',
          600: '#1b42ad',
          700: '#3663e0',
          800: '#7997ea',
          900: '#bccbf5',
          950: '#020510'
        },
        polynesian_blue: {
          DEFAULT: '#00509d',
          100: '#001020',
          200: '#00213f',
          300: '#00315f',
          400: '#00417e',
          500: '#00509d',
          600: '#0076e4',
          700: '#2c99ff',
          800: '#72bbff',
          900: '#b9ddff'
        },
        anti_flash_white: {
          DEFAULT: '#ededed',
          100: '#2f2f2f',
          200: '#5f5f5f',
          300: '#8e8e8e',
          400: '#bebebe',
          500: '#ededed',
          600: '#f1f1f1',
          700: '#f4f4f4',
          800: '#f8f8f8',
          900: '#fbfbfb'
        },
        mustard: {
          DEFAULT: '#ffdb57',
          100: '#443600',
          200: '#896b00',
          300: '#cda100',
          400: '#ffcc12',
          500: '#ffdb57',
          600: '#ffe278',
          700: '#ffe99a',
          800: '#fff0bc',
          900: '#fff8dd'
        },
        jonquil: {
          DEFAULT: '#ffcb05',
          100: '#342a00',
          200: '#685300',
          300: '#9c7d00',
          400: '#d0a600',
          500: '#ffcb05',
          600: '#ffd737',
          700: '#ffe169',
          800: '#ffeb9b',
          900: '#fff5cd'
        }
      },
      animation: {
        'blob': 'blob 7s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        glow: {
          'from': {
            'box-shadow': '0 0 20px rgba(255, 203, 5, 0.3)',
          },
          'to': {
            'box-shadow': '0 0 30px rgba(255, 219, 87, 0.5)',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}