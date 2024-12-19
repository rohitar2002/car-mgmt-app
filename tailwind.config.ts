import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B5299',
        success: '#00A676',
        warning: '#FFC107',
        error: '#D32F2F',
        background: '#F5F5F5',
        accent: '#003366',
        hover: '#E3F2FD',
      },
    },
  },
  plugins: [],
} satisfies Config;
