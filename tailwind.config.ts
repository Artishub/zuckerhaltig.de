import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        paper: "var(--paper)",
        mist: "var(--mist)",
        ash: "var(--ash)",
        smoke: "var(--smoke)",
        graphite: "var(--graphite)",
        steel: "var(--steel)",
        slate: "var(--slate)",
        marigold: "var(--marigold)",
        buttercream: "var(--buttercream)",
        cream: "var(--cream)",
        hair: "var(--hair)",
        moss: "var(--moss)",
        lime: "var(--lime)",
      },
      boxShadow: {
        card: "var(--card-shadow)",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "18px",
      },
      maxWidth: {
        page: "1180px",
      },
    },
  },
  plugins: [],
};

export default config;
