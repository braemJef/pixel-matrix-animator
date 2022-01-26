module.exports = {
  env: {
    browser: true,
  },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'airbnb-base',
    'plugin:prettier/recommended',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['promise'],
  rules: {
    'no-implicit-coercion': [
      'error',
      {
        boolean: true,
        number: true,
        string: true,
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        // importing per method packages is discouraged, see: https://lodash.com/per-method-packages
        patterns: ['lodash.*'],
      },
    ],
    'no-console': 'error',
    'no-return-await': 'off',
    'promise/avoid-new': 'error',
    'promise/no-return-wrap': 'error',
    'promise/prefer-await-to-then': 'error',
    'promise/prefer-await-to-callbacks': 'error',

    // React specific rules
    'react/prefer-stateless-function': [
      'error',
      {
        // this way you can extend PureComponent instead of having to
        // refactor a stateless class component to a function component
        ignorePureComponents: true,
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
      },
    ],
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],

    // Project specific additions added during programming
    'no-plusplus': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
