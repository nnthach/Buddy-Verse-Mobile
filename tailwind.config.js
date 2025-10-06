/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        white: {
          primary: "#FFFFFF",
          secondary: "#F8F9FA",
          third: "#E9ECEF",
          four: "#DEE2E6",
          five: "#ADB5BD",
        },
        gray: {
          primary: "#6C757D",
          secondary: "#495057",
          third: "#343A40",
          four: "#212529",
          five: "#F5F4F6",
        },
        blue: {
          primary: "#EDF0F7",
          accent: "#007BFF",
        },
        green: {
          success: "#79E34B",
        },
        purple: {
          primary: "#57298D",
          secondary: "#371661",
          third: "#361F5C",
          four: "#552196",
          five: "#CEACE3",
          tint: "#E2E1FF",
        },
        yellow: {
          primary: "#FBD157",
          secondary: "#E7BD43",
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
