module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      height: {
        18: '4.5rem',
      },
      minHeight: {
        12: '3rem',
      },
      width: {
        18: '4.5rem',
      },
      padding: {
        18: '4.5rem',
      },
      boxShadow: {
        btn: '8px 16px 24px -8px rgba(0, 0, 0, 0.12)',
        'ipt-focus': '0 0 0 3px rgba(12, 122, 138, 0.5)',
        menu: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        label:
          '0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 4px 5px -1px rgba(0, 0, 0, 0.1)',
      },
      colors: {
        echeveria: '#9fae6f',
        ember: '#d44d51',
        ocean: '#2d6da6',
        aloe: '#579f89',
        apricot: '#f29d58',
        salmon: '#e56b56',

        'my-green': '#0e90a3',
        'my-yellow': '#f2b822',
        'my-dark-green': '#0c7a8a',
        'my-orange': '#f27a22',
        'my-yellow': '#f2b822',
        'my-purple': '#944c7d',
      },
      backgroundImage: {
        'forest-landscape': 'url("/img/forest-landscape.png")',
      },
    },
    fontFamily: {
      wordmark: ['Catamaran', 'sans-serif'],
      sans: ['Inter', 'sans-serif'],
      mono: ['fira-mono', 'monospace'],
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
}
