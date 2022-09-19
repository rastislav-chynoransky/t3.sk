module.exports = {
    content: ['./index.html', './src/**/*.vue'],
    theme: {
        extend: {
            borderWidth: {
                DEFAULT: 'var(--border-width)',
            },
            colors: {
                black: '#000',
                highlight: '#e5ff00',
                white: '#d3d3d3',
                red: '#f28000',
            },
            fontFamily: {
                t3: 't3-retouch',
                media: 'mediasans-regular',
                gates: '"BS Gates"',
            },
            gridTemplateColumns: {
                calendar: 'repeat(7, minmax(var(--sm-col-width), 1fr))',
            },
            lineHeight: {
                tighter: '1.05',
            },
            outlineWidth: {
                3: '3px',
            },
            fontSize: {
                xxs: ['.5rem'],
                base: ['1rem', { letterSpacing: '.08em' }],
                '2xl': ['1.35rem', { letterSpacing: '.07em' }],
                '4xl': ['2rem', { letterSpacing: '.03em' }],
                '5xl': ['3rem', { letterSpacing: '.03em' }],
                day: 'clamp(6rem, 9vw, 9vw)',
            },
        },
    },
    plugins: [],
}
