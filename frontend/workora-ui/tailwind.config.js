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
        // Workora Brand Tokens
        "workora-deep-teal": "#075E58",
        "workora-dark": "#075E58",
        "workora-primary": "#087F73",
        "workora-teal": "#0E9F8E",
        "workora-emerald": "#19C6A3",
        "workora-aqua": "#64D8C8",
        "workora-mint": "#DDF7F2",
        "workora-bg": "#F6FAF9",
        "workora-surface": "#FFFFFF",
        "workora-border": "#DDE9E6",
        "workora-heading": "#102A2A",
        "workora-body": "#405656",
        "workora-muted": "#718686",

        // Semantic Tokens
        "brand": "#087F73",
        "primary": "#087F73",
        "primary-dark": "#075E58",
        "accent": "#0E9F8E",
        "light-surface": "#DDF7F2",
        "success": "#16A085",
        "warning": "#E9A23B",
        "error": "#D64545",
        "info": "#168AAD"
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
        "2xs": "0 1px 2px rgba(7, 94, 88, 0.04)",
        "xs": "0 1px 3px rgba(7, 94, 88, 0.06)",
        "sm": "0 2px 8px rgba(7, 94, 88, 0.05)",
        "md": "0 8px 24px -4px rgba(7, 94, 88, 0.08)",
        "lg": "0 16px 36px -6px rgba(7, 94, 88, 0.12)",
        "xl": "0 24px 48px -12px rgba(7, 94, 88, 0.16)",
        "teal": "0 10px 30px -5px rgba(8, 127, 115, 0.25)"
      },
      fontFamily: {
        "sans": ["Plus Jakarta Sans", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        "heading": ["Plus Jakarta Sans", "sans-serif"],
        "button": ["Plus Jakarta Sans", "sans-serif"],
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

