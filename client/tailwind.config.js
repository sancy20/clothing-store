/** @type {import('tailwindcss').Config} */
export default {
  // This content array is the most important part.
  // It tells Tailwind to look for class names in all .js, .jsx, .ts, and .tsx files
  // inside the src folder, as well as the main index.html file.
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
