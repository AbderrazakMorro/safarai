/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
              "on-tertiary": "#ffffff",
              "inverse-surface": "#2e3131",
              "primary-fixed": "#98f3e4",
              "primary-container": "#1c8277",
              "surface-container-high": "#e7e8e7",
              "tertiary": "#755b00",
              "surface-bright": "#f9f9f8",
              "on-secondary-container": "#4a6a65",
              "on-background": "#191c1c",
              "on-tertiary-container": "#4f3d00",
              "on-surface": "#191c1c",
              "surface": "#f9f9f8",
              "secondary-fixed-dim": "#abcec7",
              "surface-container": "#edeeed",
              "background": "#f9f9f8",
              "outline": "#6e7977",
              "on-tertiary-fixed-variant": "#584400",
              "primary": "#00685e",
              "on-primary-fixed-variant": "#005048",
              "on-primary-container": "#f4fffb",
              "on-secondary-fixed-variant": "#2d4c47",
              "error-container": "#ffdad6",
              "on-secondary-fixed": "#00201c",
              "primary-fixed-dim": "#7cd6c8",
              "on-primary": "#ffffff",
              "surface-variant": "#e1e3e2",
              "surface-tint": "#006a60",
              "surface-container-highest": "#e1e3e2",
              "secondary-container": "#c7eae2",
              "on-surface-variant": "#3e4947",
              "on-primary-fixed": "#00201c",
              "secondary-fixed": "#c7eae2",
              "on-error-container": "#93000a",
              "surface-dim": "#d9dad9",
              "error": "#ba1a1a",
              "surface-container-low": "#f3f4f3",
              "surface-container-lowest": "#ffffff",
              "outline-variant": "#bdc9c6",
              "tertiary-fixed-dim": "#ecc246",
              "tertiary-container": "#cea62c",
              "inverse-primary": "#7cd6c8",
              "on-tertiary-fixed": "#241a00",
              "tertiary-fixed": "#ffe08e",
              "on-secondary": "#ffffff",
              "on-error": "#ffffff",
              "secondary": "#44645f",
              "inverse-on-surface": "#f0f1f0"
      },
      "borderRadius": {
              "DEFAULT": "1rem",
              "lg": "2rem",
              "xl": "3rem",
              "full": "9999px"
      },
      "fontFamily": {
              "headline": ["Plus Jakarta Sans"],
              "body": ["Inter"],
              "label": ["Inter"]
      },
      "keyframes": {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        }
      },
      "animation": {
        "fade-in": "fade-in 0.4s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "spin-slow": "spin 3s linear infinite"
      }
    },
  },
  plugins: [],
}
