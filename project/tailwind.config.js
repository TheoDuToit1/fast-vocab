/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(-8%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%': { transform: 'translateY(8%)', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'pop-in': {
          '0%': { transform: 'scale(0.7)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'bounce-slow': 'bounce-slow 2.5s infinite',
        'spin-slow': 'spin-slow 3s linear infinite',
        'pop-in': 'pop-in 0.5s cubic-bezier(.68,-0.55,.27,1.55) both',
        'fade-in': 'fade-in 1s both',
      },
    },
  },
  plugins: [],
};
