import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f0f11",
        surface: "#1a1a1e",
        primary: "#e5484d",
        secondary: "#2b2b30",
      },
    },
  },
  plugins: [],
};
export default config;
