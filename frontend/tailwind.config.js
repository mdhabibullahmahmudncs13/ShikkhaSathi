/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#9333ea", // Purple 600
        secondary: "#34d399", // Emerald 400
        danger: "#f87171", // Red 400
        warning: "#fbbf24", // Amber 400
        purple: "#a78bfa", // Violet 400
        pink: "#f472b6", // Pink 400
        indigo: "#818cf8", // Indigo 400
        teal: "#2dd4bf", // Teal 400
        "background-light": "#fdfbfc",
        "background-dark": "#190f23",
        "surface-light": "#FFFFFF",
        "surface-dark": "#1E293B", // Slate 800
        "border-light": "#f1f5f9", // Slate 100
        "border-dark": "#334155", // Slate 700
        "text-main-light": "#334155", // Slate 700
        "text-main-dark": "#F8FAFC", // Slate 50
        "text-muted-light": "#94a3b8", // Slate 400
        "text-muted-dark": "#94A3B8", // Slate 400
      },
      fontFamily: {
        display: ["Lexend", "sans-serif"],
        body: ["Outfit", "sans-serif"],
        sans: ["Outfit", "sans-serif"],
        bengali: ['Noto Sans Bengali', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        '2xl': "1rem",
        full: "9999px",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)",
        "gradient-secondary": "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
        "gradient-purple": "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)",
        "gradient-pink": "linear-gradient(135deg, #f472b6 0%, #ec4899 100%)",
        "gradient-orange": "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        "gradient-light-blue": "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
        "gradient-light-teal": "linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)",
        "gradient-light-purple": "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
        "gradient-light-orange": "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'neon': '0 0 20px rgba(221, 255, 0, 0.3), 0 0 40px rgba(221, 255, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
