/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#C13D88', dark: '#ff5280' },
        dark: {
          DEFAULT: '#000000',
          card: '#1F1F1F',
          surface: '#2A2A2A',
          text: '#B0B0B0'
        }
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      screens: { xs: '375px' },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        glow: 'glow 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      }
    },
  },
  
  plugins: [],
}
