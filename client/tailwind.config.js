/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#0ea5e9',
        'secondary': '#1e40af',
        'light': '#f3f4f6',
        'dark': '#1f2937',
        'danger': '#ef4444',
        'warning': '#f59e0b',
        'success': '#22c55e',
        'info': '#3b82f6',

      },
    },
  },
  plugins: [],
}

