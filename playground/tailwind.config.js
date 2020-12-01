// eslint-disable-next-line no-undef
module.exports = {
  purge: ["./src/pages/**/*.js", "./src/components/**/*.js"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      primary: {
        100: "var(--colors-primary-100)",
        300: "var(--colors-primary-300)",
        500: "var(--colors-primary-500)",
        700: "var(--colors-primary-700)",
        900: "var(--colors-primary-900)"
      }
    },
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
};
