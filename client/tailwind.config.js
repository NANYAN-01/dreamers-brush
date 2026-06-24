// Paths are relative to project root (where webpack runs from)
// Note: Cannot use absolute paths because fast-glob doesn't handle apostrophes in paths
module.exports = {
  content: [
    './client/src/**/*.{js,jsx,ts,tsx}',
    './client/index.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      }
    }
  },
  plugins: []
};
