const { createGlobPatternsForDependencies } = require('@nx/vue/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'index.html'),
    join(__dirname, 'src/styles.scss'),
    join(__dirname, 'src/**/*!(*.stories|*.spec).{vue,ts,tsx,js,jsx,scss}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
