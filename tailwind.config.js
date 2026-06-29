/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5a45cb",
        "primary-container": "#7360e5",
        "primary-fixed": "#e5deff",
        secondary: "#00658f",
        "secondary-container": "#4cbdfe",
        tertiary: "#5c5b67",
        background: "#faf8ff",
        "background-dark": "#0b0f19",
        surface: "#faf8ff",
        "surface-dark": "#131b2e",
        "surface-variant": "#dae2fd",
        "on-surface": "#131b2e",
        "on-surface-variant": "#474554",
        outline: "#787585",
        "outline-variant": "#c9c4d6",
      },
      fontFamily: {
        display: ["Hanken Grotesk", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "24px",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};