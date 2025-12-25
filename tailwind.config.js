module.exports = {
    content: ['./index.html', './src/**/*.vue'],
    theme: {
        extend: {
            borderWidth: {
                DEFAULT: 'var(--border-width)',
            },
            gridTemplateColumns: {
                calendar: 'repeat(7, minmax(var(--sm-col-width), 1fr))',
            },
            lineHeight: {
                tighter: 1.1,
            },
        },
        colors: {
            highlight: '#c8ff00',
            gray: '#d3d3d3',
            red: '#f28000',
            white: 'white',
            black: 'black',
            transparent: 'transparent',
        },
        fontFamily: {
            t3: 't3-retouch',
            media: 'mediasans-regular',
            gates: '"BS Gates"',
        },
        fontSize: {
            xxs: '.65rem',
            xs: '.75rem',
            base: '1rem',
            lg: '1.125rem',
            '2xl': '1.35rem',
            '4xl': '2.5rem',
            '5xl': '3rem',
            day: 'clamp(6rem, 9vw, 9vw)',
        },
    },
    plugins: [],
}
