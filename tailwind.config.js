/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "var(--accent-subtle)",
          100: "var(--accent-subtle)",
          200: "var(--accent-subtle)",
          300: "var(--accent-text)",
          400: "var(--accent-text)",
          500: "var(--accent)",
          600: "var(--accent)",
          700: "var(--accent-hover)",
          800: "var(--accent-hover)",
          900: "var(--accent-hover)",
          950: "var(--accent-hover)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.4s ease-out",
        "pixel-glow": "pixelGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pixelGlow: {
          "0%, 100%": { boxShadow: "0 0 8px 2px rgba(98,114,245,0.4)" },
          "50%": { boxShadow: "0 0 20px 6px rgba(98,114,245,0.7)" },
        },
      },
    },
  },
  plugins: [],
};
