/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base:     '#F8F9FA',  // Google's page background
          surface:  '#FFFFFF',  // Cards, panels
          elevated: '#F1F3F4',  // Hover states
          border:   '#DADCE0',  // Borders, dividers
        },
        text: {
          primary:   '#3C4043',  // Main text
          secondary: '#70757A',  // Secondary text
          tertiary:  '#9AA0A6',  // Placeholder, disabled
        },
        accent: {
          DEFAULT: '#1A73E8',   // Google Blue
          hover:   '#1558B0',
          dim:     '#E8F0FE',
        },
        success: {
          DEFAULT: '#34A853',   // Google Green
          dim:     '#E6F4EA',
        },
        danger: {
          DEFAULT: '#EA4335',   // Google Red
          dim:     '#FCE8E6',
        },
      },
      boxShadow: {
        'card':       '0 1px 2px rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
        'card-hover': '0 1px 3px rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
        'btn':        '0 1px 2px rgba(60,64,67,.3)',
        'btn-hover':  '0 1px 3px rgba(60,64,67,.4)',
        'header':     '0 1px 3px rgba(60,64,67,.14)',
        'popover':    '0 2px 6px 2px rgba(60,64,67,.15)',
      },
      fontFamily: {
        sans: ['Roboto', 'Inter', 'sans-serif'],
        mono: ['"Roboto Mono"', '"DM Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
