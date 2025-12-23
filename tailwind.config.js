/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'kraken-bg': '#0b0e11',
                'kraken-panel': '#161a1e',
                'kraken-border': '#2a2a2a',
            }
        },
    },
    plugins: [],
}
