// const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./src/pages/**/*.js", "./src/components/**/*.js"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          lighest: "var(--colors-primary-lightest)",
          lighter: "var(--colors-primary-lighter)",
          DEFAULT: "var(--colors-primary-regular)",
          darker: "var(--colors-primary-darker)",
          darkest: "var(--colors-primary-darkest)"
        },
        background: {
          lightest: "var(--colors-background-lightest)",
          lighter: "var(--colors-background-lighter)",
          DEFAULT: "var(--colors-background-regular)",
          darker: "var(--colors-background-darker)",
          darkest: "var(--colors-background-darkest)"
        }
      },
      fontFamily: {
        sans: ["Wotfard"]
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
