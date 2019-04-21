module.exports = {
  root: true,
  extends: 'standard',
  parser: 'babel-eslint',
  env: {
    browser: true
  },
  plugins: [
    'html'
  ],
  rules: {
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'camelcase': 0
  }
}
