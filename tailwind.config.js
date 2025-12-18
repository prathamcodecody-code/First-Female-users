/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brandPink: "#E91E63",
        brandPinkLight: "#F48FB1",
        brandRed: "#D32F2F",
        brandCream: "#FFF8E7",
        brandBlack: "#212121",
        brandGray: "#757575",
      },
    },
  },
  plugins: [],
  safelist: [
  "text-brandPink",
  "text-blue-600",
  "text-yellow-500",
  "hover:text-brandPink",
  "hover:text-blue-600",
  "hover:text-yellow-500",
],

};
