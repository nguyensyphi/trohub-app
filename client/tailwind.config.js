const defaultTheme = require("tailwindcss/defaultTheme")

const SPACING_SCALE = 1.15

const scaleCssLength = (value, factor = SPACING_SCALE) => {
  if (value === "0px" || value === "0rem" || value === "0") return value

  const match = value.match(/^(-?\d*\.?\d+)(rem|px)$/)
  if (!match) return value

  const scaledValue = parseFloat(match[1]) * factor
  const normalized = scaledValue.toFixed(4).replace(/\.?0+$/, "")

  return `${normalized}${match[2]}`
}

const scaledSpacing = Object.fromEntries(
  Object.entries(defaultTheme.spacing).map(([key, value]) => [key, scaleCssLength(value)])
)

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    spacing: scaledSpacing,
    borderRadius: {
      none: "0px",
      sm: "2px",
      DEFAULT: "4px",
      md: "4px",
      lg: "4px",
      xl: "4px",
      "2xl": "4px",
      "3xl": "4px",
      full: "9999px",
    },
    boxShadow: {
      sm: "0 1px 0 rgba(26, 43, 76, 0.1), 0 0 0 1px rgba(226, 232, 240, 0.95)",
      DEFAULT: "0 2px 0 rgba(26, 43, 76, 0.1), 0 0 0 1px rgba(226, 232, 240, 0.95)",
      md: "0 4px 0 rgba(26, 43, 76, 0.1), 0 0 0 1px rgba(226, 232, 240, 0.95)",
      lg: "0 6px 0 rgba(26, 43, 76, 0.1), 0 0 0 1px rgba(226, 232, 240, 0.95)",
      xl: "0 8px 0 rgba(26, 43, 76, 0.1), 0 0 0 1px rgba(226, 232, 240, 0.95)",
      "2xl": "0 12px 0 rgba(26, 43, 76, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.95)",
      inner: "inset 0 0 0 1px rgba(226, 232, 240, 0.95)",
      none: "none",
    },
    extend: {
      colors: {
        brand: {
          navy: "#1A2B4C",
          orange: "#F26522",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      width: {
        main: "min(1100px, calc(100vw - 1rem))",
      },
      keyframes: {
        blink: {
          "0%": {
            opacity: 0.5,
          },
          "50%": {
            opacity: 1,
            transform: "translateY(-4px);",
          },
          "100%": {
            opacity: 0.5,
          },
        },
      },
      animation: {
        "blink-0": "blink 1s linear 0s infinite",
        "blink-0.2": "blink 1s linear 0.2s infinite",
        "blink-0.4": "blink 1s linear 0.4s infinite",
      },
    },
    fontFamily: {
      sans: ["Be Vietnam Pro", "Plus Jakarta Sans", "sans-serif"],
      display: ["Plus Jakarta Sans", "Be Vietnam Pro", "sans-serif"],
    },
  },
  plugins: [require("tailwindcss-animate")],
}
