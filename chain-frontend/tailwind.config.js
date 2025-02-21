/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "bg-color": "#282A40",
        neutral: "#9B99B0",
        primary: "#676CF6",
      },
    },
  },
};
