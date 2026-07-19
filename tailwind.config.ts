import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#071A3D',
          card: '#101B45',
          dark: '#030E26',
          border: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(123, 97, 255, 0.15)',
        },
        neon: {
          purple: '#7B61FF',
          cyan: '#00C8FF',
          green: '#00E676',
          yellow: '#FFC107',
          red: '#FF5252',
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      }
    },
  },
  plugins: [],
};
export default config;
