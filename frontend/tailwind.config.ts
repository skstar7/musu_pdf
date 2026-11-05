import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#111111",
        muted: "#737373",
        card: "#FAFAFA",
        border: "#E5E5E5",
        primary: "#000000",
        "primary-foreground": "#FFFFFF",
        "hover-bg": "#F2F2F2"
      },
      borderRadius: {
        xl: "1rem"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      },
      boxShadow: {
        soft: "0 8px 24px rgba(17, 17, 17, 0.06)"
      }
    }
  },
  plugins: []
} satisfies Config;
