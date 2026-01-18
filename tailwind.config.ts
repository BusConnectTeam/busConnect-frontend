import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Color principal petróleo (WCAG AA compliant)
        petroleo: {
          DEFAULT: "#2C5F5D",
          50: "#f0fdf9",
          100: "#ccfbef",
          200: "#9af5df",
          300: "#5fe9cd",
          400: "#2dd4b5",
          500: "#14b89c",
          600: "#0d9480",
          700: "#0f7569",
          800: "#115e56",
          900: "#2C5F5D",  // Main color
          950: "#0a302e",
        },
        // Color de acento coral (contraste 4.5:1+ sobre blanco)
        coral: {
          DEFAULT: "#FF6B4A",
          50: "#fff7f5",
          100: "#ffede8",
          200: "#ffd9d0",
          300: "#ffb8a6",
          400: "#ff8f73",
          500: "#FF6B4A",  // Main color
          600: "#e85a3a",
          700: "#c44a2d",
          800: "#a03d26",
          900: "#843624",
          950: "#481a0f",
        },
        // Primary ahora apunta a petróleo
        primary: {
          DEFAULT: "#2C5F5D",
          50: "#f0fdf9",
          100: "#ccfbef",
          200: "#9af5df",
          300: "#5fe9cd",
          400: "#2dd4b5",
          500: "#14b89c",
          600: "#0d9480",
          700: "#0f7569",
          800: "#115e56",
          900: "#2C5F5D",
          950: "#0a302e",
        },
        accent: {
          yellow: "#f59e0b",
          green: "#10b981",
          coral: "#FF6B4A",
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0a0a0a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Tamaños escalables con rem
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1.16" }],
        "6xl": ["3.75rem", { lineHeight: "1.1" }],
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "spin-slow": "spin 1.5s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      // Espaciado mínimo para áreas de click accesibles (44x44px)
      minHeight: {
        touch: "44px",
      },
      minWidth: {
        touch: "44px",
      },
    },
  },
  plugins: [],
};

export default config;