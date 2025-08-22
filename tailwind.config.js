/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        purple: {
          primary: "#57298D",
          secondary: "#371661",
          third: "#361F5C",
        },
        beige: {
          primary: "#F1F3E7",
        },
      },
      fontFamily: {
        black: ["PoppinsBlack"],
        bold: ["PoppinsBold"],
        semibold: ["PoppinsSemiBold"],
        medium: ["PoppinsMedium"],
        regular: ["PoppinsRegular"],
        light: ["PoppinsLight"],
      },
    },
  },
  plugins: [],
};
