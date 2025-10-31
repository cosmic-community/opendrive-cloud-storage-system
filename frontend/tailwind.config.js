module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a73e8',
        'primary-hover': '#1557b0',
        'dark-bg': '#1f1f1f',
        'dark-surface': '#2c2c2c',
        'dark-border': '#3c3c3c'
      }
    },
  },
  plugins: [],
}