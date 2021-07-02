module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    "ecmaVersion": 7,
    "sourceType": 'module',
    "parser": 'babel-eslint',
  },
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': ['warn', {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: true,
      argsIgnorePattern: '^_',
    }],
    'no-empty': ['error', {allowEmptyCatch: true}],
  },
};
