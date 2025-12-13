/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main Backgrounds
        background: '#0F172A', // Very Dark Blue (App background)
        surface: '#334155',    // Dark Slate (Card/Modal background)

        // Text & UI Elements
        primary: '#3B82F6',    // Bright Blue (Main Buttons/Links)
        secondary: '#34D399',  // Emerald Green (Success states/Highlights)
        muted: '#94a3b8',      // Light Grey (Subtitles/Borders)
      },
    },
  },
  plugins: [],
}