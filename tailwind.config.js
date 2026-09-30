/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF9F5',
          100: '#F5F3EC',
          200: '#EBE7DD',
          300: '#DED8CB',
          400: '#C9C2B2',
          500: '#AEA694',
          600: '#908773',
          700: '#756D5B',
          800: '#5C5445',
          900: '#463F32',
        },
        creamgreen: {
          50: '#F4F8F5',
          100: '#E7F2EA',
          200: '#D0E6D6',
          300: '#A7CFB1',
          400: '#76B384',
          500: '#4B935B',
          600: '#387847',
          700: '#2A5D37',
          800: '#1D4528',
          900: '#122E1A',
          950: '#0A1B0E',
        },
        luxury: {
          obsidian: '#0E1B12',
          charcoal: '#182A1E',
          espresso: '#263B2C',
          forest: '#35593F',
          warmgray: '#496251',
          muted: '#688270',
          subtle: '#96AB9D',
          border: '#D2E3D6',
          card: '#FFFFFF',
          cardcream: '#F7FAF7',
          gold: '#D4AF37',
          goldlight: '#F7EBC6',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        heading: ['"Outfit"', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(18, 46, 26, 0.08), 0 0 1px 1px rgba(75, 147, 91, 0.12)',
        'luxury-hover': '0 25px 50px -12px rgba(18, 46, 26, 0.16), 0 0 2px 1px rgba(75, 147, 91, 0.25)',
        'creamy-glow': '0 0 35px -5px rgba(208, 230, 214, 0.55)',
        'card-soft': '0 10px 30px -10px rgba(14, 27, 18, 0.06)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
