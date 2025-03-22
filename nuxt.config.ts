export default defineNuxtConfig({
    compatibilityDate: '2024-12-22',
    devtools: { enabled: false },
    srcDir: 'src/',
    css: ['@/assets/css/tailwind.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    runtimeConfig: {
        public: {
            apiBase: 'http://localhost:5000'
        }
    }
});
