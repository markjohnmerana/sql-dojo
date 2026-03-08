/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        dojo: {
          bg: '#0a0a0f',
          surface: '#111118',
          border: '#1e1e2e',
          red: '#ff3b3b',
          orange: '#ff6b35',
          yellow: '#ffd60a',
          green: '#00ff88',
          blue: '#4d9fff',
          purple: '#a855f7',
          muted: '#4a4a6a',
          text: '#e2e2f0',
          dim: '#8888aa',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'flicker': 'flicker 4s linear infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '92%': { opacity: 1 },
          '93%': { opacity: 0.8 },
          '94%': { opacity: 1 },
          '96%': { opacity: 0.9 },
          '97%': { opacity: 1 },
        },
        slideUp: {
          from: { transform: 'translateY(12px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        glow: {
          from: { textShadow: '0 0 10px #ff3b3b88' },
          to: { textShadow: '0 0 20px #ff3b3bcc, 0 0 40px #ff3b3b44' },
        }
      }
    },
  },
  plugins: [],
}
