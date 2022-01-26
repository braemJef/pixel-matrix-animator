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
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
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
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.js'] }],
    'react/prop-types': 'off',

    // Project specific additions added during programming
    'no-plusplus': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'no-console': 'off',
    'no-param-reassign': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
};
