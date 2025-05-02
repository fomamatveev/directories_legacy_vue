import {getApiUrl} from "~/api/config.js";

export const login = async (username, password) => {
    try {
        const config = useRuntimeConfig();
        return await $fetch(`${getApiUrl()}/auth/login`, {
            method: 'POST',
            body: {username, password},
            credentials: 'include', // Для работы с куки
        });
    } catch (error) {
        console.error('Ошибка входа:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        const config = useRuntimeConfig();
        return await $fetch(`${getApiUrl()}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
    } catch (error) {
        console.error('Ошибка выхода:', error);
        throw error;
    }
};

export const getMe = async () => {
    try {
        const config = useRuntimeConfig();

        await $fetch(`${getApiUrl()}/auth/getme`, {
            method: 'GET',
            credentials: 'include',
        });

        return true;
    } catch (error) {
        return false;
    }
};
