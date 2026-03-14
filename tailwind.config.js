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
          50: '#f0eeff',
          100: '#e4e0ff',
          200: '#cdc5ff',
          300: '#b0a3ff',
          400: '#9178ff',
          500: '#6c63ff',
          600: '#5a4fe0',
          700: '#4b3fc0',
          800: '#3d349b',
          900: '#2e2675',
        },
        dark: {
          50: '#e8e8f0',
          100: '#c5c5d8',
          200: '#9e9ebf',
          300: '#7575a4',
          400: '#525290',
          500: '#28284d',
          600: '#1e1e3f',
          700: '#16162e',
          800: '#0f0f1a',
          900: '#08080e',
        },
        accent: {
          gold: '#f5c518',
          teal: '#00d4aa',
          coral: '#ff6b6b',
          sky: '#4fc3f7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-soft': 'bounceSoft 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
