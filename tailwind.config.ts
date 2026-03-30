import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#edfafa',
          100: '#d5f5f6',
          200: '#afecee',
          300: '#7edce2',
          400: '#16bdca',
          500: '#0694a2',
          600: '#047481',
          700: '#036672',
          800: '#05505c',
          900: '#014451',
        },
      },
      fontFamily: {
        sans: ['var(--font-sarabun)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
