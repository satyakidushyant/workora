/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      'xs': '360px',
      'sm': '640px',
      'md': '768px',
      'tablet': '820px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1440px',
      '3xl': '1920px'
    },
    extend: {
      colors: {
        // Core Workora Brand Palette
        "workora-dark": "#063B39",
        "workora-primary": "#0E6E68",
        "workora-accent": "#3FA79B",
        "workora-light": "#DCEBE7",
        "workora-surface": "#F4F8F7",
        "workora-text": "#163331",
        "workora-muted": "#6B7F7C",

        // Semantic mappings
        "primary": "#0E6E68",
        "primary-dark": "#063B39",
        "accent": "#3FA79B",
        "light-surface": "#DCEBE7",
        "success": "#10B981",
        "warning": "#F59E0B",
        "error": "#EF4444",
        "info": "#0E6E68"
      },
      borderRadius: {
        "sm": "8px",
        "md": "12px",
        "lg": "16px",
        "xl": "20px",
        "2xl": "24px",
        "3xl": "32px",
        "full": "9999px"
      },
      boxShadow: {
        "sm": "0 2px 8px rgba(6, 59, 57, 0.04)",
        "md": "0 8px 24px -4px rgba(6, 59, 57, 0.08)",
        "lg": "0 16px 36px -6px rgba(6, 59, 57, 0.12)",
        "xl": "0 24px 48px -12px rgba(6, 59, 57, 0.16)",
        "teal": "0 10px 30px -5px rgba(14, 110, 104, 0.25)"
      },
      fontFamily: {
        "sans": ["Plus Jakarta Sans", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        "heading": ["Plus Jakarta Sans", "Manrope", "sans-serif"],
        "mono": ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"]
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
        "ultra": "120rem"
      }
    }
  },
  plugins: [],
}
