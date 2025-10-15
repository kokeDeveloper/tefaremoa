const { addDynamicIconSelectors } = require('@iconify/tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sansation: ['Sansation', 'system-ui', '-apple-system', "Segoe UI", 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Oswald', 'sans-serif'],
        sans: ['Sansation', 'system-ui', '-apple-system', "Segoe UI", 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Oswald', 'sans-serif']
      }
    },
  },
  plugins: [addDynamicIconSelectors()],
};

export default module.exports;
