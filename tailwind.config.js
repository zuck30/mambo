/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2563EB', light: '#3B82F6', dark: '#1D4ED8' },
        accent: '#38BDF8',
        navy: { DEFAULT: '#0F172A', light: '#1E293B' },
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
