module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:react-hooks/recommended",
    "prettier",
    "prettier/react"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 11,
    sourceType: "module"
  },
  plugins: ["react", "jsx-a11y", "react-hooks", "prettier"],
  rules: {
    "prettier/prettier": "error"
  }
};
