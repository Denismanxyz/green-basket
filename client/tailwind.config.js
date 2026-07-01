export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edf7f2',
          100: '#d4eee1',
          500: '#26845a',
          600: '#1f6d4b',
          700: '#19583e'
        },
        ink: '#1f2933'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(31, 41, 51, 0.08)'
      }
    }
  },
  plugins: []
};
