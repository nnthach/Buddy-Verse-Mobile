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
          four: "#552196",
          five: "#CEACE3",
        },
        beige: {
          primary: "#F1F3E7",
        },
        blue: {
          primary: "#EDF0F7",
        },
        green: {
          success: "#79E34B",
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
      boxShadow: {
        custom: "0px 0px 10px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};
