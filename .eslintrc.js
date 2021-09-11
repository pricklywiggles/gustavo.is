module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 11,
    sourceType: 'module'
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      excludedFiles: ['*.js', '*.jsx'],
      parser: '@typescript-eslint/parser',
      plugins: [
        'react',
        'react-hooks',
        'jsx-a11y',
        '@typescript-eslint',
        'prettier'
      ],
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
      ],
      rules: {
        'prettier/prettier': 'error',
        'no-console': 'warn',
        'react/prop-types': 'off'
      }
    },
    {
      files: ['*.js', '*.jsx'],
      plugins: ['react', 'jsx-a11y', 'react-hooks', 'prettier'],
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:react-hooks/recommended',
        'prettier'
      ],
      rules: {
        'prettier/prettier': 'error',
        'react/prop-types': 'off',
        'jsx-a11y/anchor-is-valid': [
          'error',
          {
            components: ['Link'],
            specialLink: ['hrefLeft', 'hrefRight'],
            aspects: ['invalidHref', 'preferButton']
          }
        ]
      }
    }
  ]
};
