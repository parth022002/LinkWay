import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // LinkWay Approved Brand Tokens
        lw: {
          navy: "#0B1430",
          "navy-surface": "#101B3B",
          ink: "#111D3B",
          slate: "#55627C",
          muted: "#71809B",
          border: "#E2E8F2",
          canvas: "#F6F8FC",
          violet: "#9636F5",
          blue: "#2458F5",
          cyan: "#08C8E8",
          indigo: "#4438CA",
          success: "#16856C",
          warning: "#B7791F",
          danger: "#C63D5A",
        },
      },
      backgroundImage: {
        "lw-gradient": "linear-gradient(112deg, #9636F5 0%, #2458F5 52%, #08C8E8 100%)",
        "lw-gradient-subtle": "linear-gradient(135deg, rgba(150, 54, 245, 0.08) 0%, rgba(36, 88, 245, 0.08) 50%, rgba(8, 200, 232, 0.08) 100%)",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
