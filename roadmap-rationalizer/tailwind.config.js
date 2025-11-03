/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: '#071B17',
          900: '#0B3D34',
          700: '#0F6B5C',
          600: '#1A8A74',
          400: '#43A089',
          border: '#13443B',
        },
        gold: {
          base: '#D4AF37',
          hi: '#F2D48F',
          lo: '#9D7A1F',
        },
        fog: '#EAF2F1',
        seafoam: '#C7E0DA',
        success: '#25B78A',
        error: '#D54B4B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Lexend', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        satin: '0 8px 18px rgba(0,0,0,0.35)',
        glow: '0 0 18px rgba(212,175,55,0.22)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

