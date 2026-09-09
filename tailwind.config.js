/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        palette: {
          indigo: '#4F00BC',
          magenta: '#A100B2',
          pink: '#FF3B77',
          yellow: '#FDD116',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #4F00BC 0%, #A100B2 33%, #FF3B77 66%, #FDD116 100%)',
        'glow-gradient': 'radial-gradient(circle, rgba(161,0,178,0.15) 0%, rgba(79,0,188,0.05) 50%, rgba(0,0,0,0) 100%)',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        'glow-magenta': '0 0 25px rgba(161, 0, 178, 0.35)',
        'glow-pink': '0 0 25px rgba(255, 59, 119, 0.35)',
        'glow-yellow': '0 0 25px rgba(253, 209, 22, 0.35)',
        'glow-indigo': '0 0 25px rgba(79, 0, 188, 0.35)',
      }
    },
  },
  plugins: [],
}
