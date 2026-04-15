/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base:     '#0A0A0B',
          surface:  '#111113',
          elevated: '#1A1A1E',
          border:   '#2A2A2F',
        },
        text: {
          primary:   '#F0F0F2',
          secondary: '#8A8A96',
          tertiary:  '#55555E',
        },
        accent: {
          DEFAULT: '#5B6EF5',
          hover:   '#6B7EFF',
          dim:     '#1E2154',
        },
        success: {
          DEFAULT: '#22C55E',
          dim:     '#0D2818',
        },
        danger: {
          DEFAULT: '#EF4444',
          dim:     '#2A0F0F',
        },
      },
      fontFamily: {
        mono: ['"DM Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
