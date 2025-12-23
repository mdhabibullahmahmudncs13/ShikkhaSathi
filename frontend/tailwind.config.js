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
        primary: "#6366F1", // Indigo 500
        secondary: "#EC4899", // Pink 500
        accent: "#8B5CF6", // Violet 500
        success: "#10B981", // Emerald 500
        "background-light": "#F8FAFC", // Slate 50 - Cooler light bg
        "background-dark": "#0F172A", // Slate 900
        "card-light": "#FFFFFF",
        "card-dark": "#1E293B", // Slate 800
        "text-light": "#334155", // Slate 700
        "text-dark": "#F1F5F9", // Slate 100
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Nunito", "sans-serif"],
        bengali: ['Noto Sans Bengali', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: "0.75rem",
        'lg': '12px',
        'xl': "1rem",
        '2xl': "1.5rem",
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'neon': '0 0 20px rgba(221, 255, 0, 0.3), 0 0 40px rgba(221, 255, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
