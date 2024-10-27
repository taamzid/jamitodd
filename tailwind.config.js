/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "bg-one":
          "linear-gradient(to bottom, #3F99F9, #32ADF8, #6B4DEB, #6B4DEB)",
        "bg-artist-btn":
          "linear-gradient(to right, #D71C9F, #4498F7)",
        "bg-artist-back":
          "linear-gradient(to right, #D020A3, #3800AC)",
        "bg-search":
          "linear-gradient(to bottom, #39A3FA, #6B4DEB)",
      },
    },
  },
  plugins: [],
};
