/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx}'],
  theme: {
    extend: {
      colors: {
        'custom-green': {
          100: '#2071B2',
        },
        'cm-orange': {
          100: '#F48C06',
        },
        header: '#0052B4',
        btn: '#49BBBD',
        'light-btn': 'rgba(73, 187, 189, 0.60)',
        foreground: '#273240',
        word: '#272835',
      },
      backgroundColor: {
        form: 'rgb(188,206,226)',
        background: '#F0F7FF',
        'custom-green': {
          100: '#2071B2',
        },
        header: '#0052B4',
        dashboard: {
          100: '#5A6ACF',
          200: '#ff9900',
        },
        btn: '#49BBBD',
        light: 'rgba(255, 255, 255, 0.30)',
      },
      padding: {
        sm: '0.625rem',
        base: '0.9375rem',
      },
      backgroundImage: {
        hero: 'linear-gradient(rgba(0,0,0,0.8),rgba(0,0,0,0.2)),url("/hero.webp")',
        active:
          'linear-gradient(90deg, rgba(255, 255, 255, 0.88) -17.8%, rgba(255, 255, 255, 0.00) 88.26%)',
        error:
          'url("../src/assets/404.png"), url("../src/assets/circle.svg"), url("../src/assets/cross.svg")',
      },
      boxShadow: {
        hero: '0px 4px 100px 0px rgba(29, 28, 24, 0.25)',
      },
      backgroundPosition: {
        pl: '3% 50%',
      },
    },
  },
  plugins: [],
};
