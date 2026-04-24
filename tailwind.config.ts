import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        fluxa: {
          red: "#C41C3B",
          "red-hover": "#A01530",
          "red-light": "#E8254A",
          beige: "#FFE6D2",
          "beige-dark": "#F5C9A8",
          dark: "#050510",
          "dark-card": "#0D0D1A",
          "dark-border": "#1A1A2E",
          "dark-hover": "#1C1C30",
          "dark-muted": "#888888",
          white: "#FFF2EA",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
