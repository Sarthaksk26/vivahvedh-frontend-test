/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          container: "hsl(var(--primary-container))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Marathi Cultural Colors */
        kumkum: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#C41E2A',
          600: '#A8171F',
          700: '#8B1218',
          800: '#6E0E12',
          900: '#520A0D',
        },
        haldi: {
          50: '#fefce8',
          100: '#fef9c3',
          400: '#FACC15',
          500: '#E8A317',
          600: '#CA8A04',
          700: '#A16207',
        },
        saffron: {
          400: '#FB923C',
          500: '#E87817',
          600: '#D4690E',
        },
        paan: {
          400: '#4ADE80',
          500: '#2D8F4E',
          600: '#1B6B37',
        },
      },
      fontFamily: {
        sans: ["'Mukta'", "sans-serif"],
        display: ["'Tiro Devanagari Marathi'", "serif"],
        serif: ["'Tiro Devanagari Marathi'", "Georgia", "serif"],
        ui: ["'Inter'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'sm-soft': '0 2px 8px -2px rgba(0, 0, 0, 0.05)',
        'md-soft': '0 4px 16px -4px rgba(0, 0, 0, 0.08)',
        'lg-soft': '0 8px 32px -8px rgba(0, 0, 0, 0.1)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.08)',
        'ambient': '0 8px 30px -10px rgba(0, 0, 0, 0.08)',
        'kumkum': '0 10px 30px -8px rgba(196, 30, 42, 0.25)',
        'gold': '0 10px 30px -8px rgba(232, 163, 23, 0.25)',
        'premium': '0 20px 60px -15px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 20px 40px -12px rgba(196, 30, 42, 0.12)',
      },
      backgroundImage: {
        'gradient-kumkum': 'linear-gradient(135deg, #C41E2A 0%, #8B1218 100%)',
        'gradient-gold': 'linear-gradient(135deg, #E8A317 0%, #CA8A04 100%)',
        'gradient-saffron': 'linear-gradient(135deg, #E87817 0%, #C41E2A 100%)',
        'gradient-warm': 'linear-gradient(180deg, #FFFBF0 0%, #FFF7E6 50%, #FFFBF0 100%)',
        'gradient-hero': 'linear-gradient(160deg, #FFFCF5 0%, #FFF8EB 30%, #FFF5E1 60%, #FFFCF5 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
    },
  },
  plugins: [],
}
