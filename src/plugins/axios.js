import axios from 'axios';

export default defineNuxtPlugin(nuxtApp => {
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:5000',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Добавьте axios в глобальные свойства приложения
    nuxtApp.provide('axios', axiosInstance);
});
