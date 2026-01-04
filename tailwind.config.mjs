/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./Component/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // SaaS Color Palette
        primary: "#6d28d9", // Vibrant purple (accent only)
        secondary: "#64748b", // Slate gray
        accent: "#6d28d9", // Purple accent
        "accent-light": "#f5f3ff", // Very light purple tint
        "text-primary": "#1e293b", // Dark text
        "text-secondary": "#64748b", // Medium gray text
        "border-light": "#e2e8f0", // Light border
        "bg-light": "#f8fafc", // Off-white background
      },
    },
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#6d28d9", // Purple accent
          "secondary": "#64748b", // Slate
          "accent": "#6d28d9", // Purple
          "neutral": "#1e293b", // Dark text
          "base-100": "#ffffff", // Pure white
          "base-200": "#f8fafc", // Off-white
          "base-300": "#e2e8f0", // Light border
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
        dark: {
          "primary": "#a78bfa", // Light purple for dark mode
          "secondary": "#cbd5e1", // Light slate
          "accent": "#a78bfa", // Light purple
          "neutral": "#f1f5f9", // Light text for dark
          "base-100": "#0f172a", // Dark bg (not black)
          "base-200": "#1e293b", // Slightly lighter
          "base-300": "#334155", // Borders
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
    ],
  },
};

export default config;
