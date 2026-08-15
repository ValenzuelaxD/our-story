/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Lora', 'Georgia', 'serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(5deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        heartBeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        heartBeatSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        heartsFall: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '0.4' },
          '15%': { opacity: '0.6' },
          '85%': { opacity: '0.3' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0.2' },
        },
        softFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        softPulse: {
          '0%, 100%': { opacity: '0.92' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        fadeInUp: 'fadeInUp 0.6s ease-out both',
        float: 'float 4s ease-in-out infinite',
        pulseSoft: 'pulseSoft 2s ease-in-out infinite',
        heartBeat: 'heartBeat 1.5s ease-in-out infinite',
        heartBeatSoft: 'heartBeatSoft 2.5s ease-in-out infinite',
        heartsFall: 'heartsFall 12s linear infinite',
        softFloat: 'softFloat 5s ease-in-out infinite',
        softPulse: 'softPulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
