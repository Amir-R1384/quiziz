module.exports = {
    content: ['./views/**/*.ejs', './public/**/*.html'],
    theme: {
        extend: {
            colors: {
                primary: '#25a55f',
                secondary: '#0d6560'
            },
            borderWidth: {
                6: '6px'
            },
            animation: {
                rotate: 'rotate 1.5s cubic-bezier(0.3, 0.15, 0.7, 0.85) infinite'
            }
        }
    },
    important: true
}
