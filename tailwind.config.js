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
      brandPinkLight: "#FDEFF4", // Lighter for section backgrounds
      brandRed: "#D32F2F",
      brandCream: "#FAF9F6", // That luxury off-white
      brandBlack: "#1A1A1A", // Softer black for high-end feel
      brandGray: "#666666",
    },
    letterSpacing: {
      'boutique': '.15em',
      'ultra': '.25em',
    },
    // Adding a custom transition for that smooth Framer Motion feel
    transitionTimingFunction: {
      'soft-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
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
