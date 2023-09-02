module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    mocha: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {},
};
