module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        comfortaa: ['"Comfortaa"', 'sans-serif'], // Fuente login
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
};
