module.exports = {
  content: ['./src/**/*.vue'],
  theme: {
    extend: {
      borderWidth: {
        3: '1px',
      },
      colors: {
        black: '#000',
        highlight: '#e5ff00',
        white: '#d3d3d3',
        red: '#f28000'
      },
      fontFamily: {
        t3: 't3-retouch',
        media: 'mediasans-regular',
        gates: '"BS Gates"',
      },
      gridTemplateColumns: {
        calendar: 'repeat(7, minmax(8rem, 1fr))'
      },
      lineHeight: {
        tighter: '1.05',
      },
      outlineWidth: {
        3: '3px',
      },
      fontSize: {
        'xxs': ['.5rem'],
        'base': ['1rem', { letterSpacing: '.08em' }],
        '2xl': ['1.5rem', { letterSpacing: '.05em' }],
        '5xl': ['3rem', { letterSpacing: '.03em' }],
      }
    },
  },
  plugins: [],
}
