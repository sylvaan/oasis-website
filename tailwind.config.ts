import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },
        accent: {
          50: "#faf5f0",
          100: "#f5ebe1",
          200: "#e6d2bc",
          300: "#d6b997",
          400: "#c69963",
          500: "#b78a55",
          600: "#936e44",
          700: "#6f5333",
          800: "#4a3722",
          900: "#251c11",
        },
      },
    },
  },
  plugins: [],
};
export default config;
