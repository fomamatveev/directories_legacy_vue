import {getApiUrl} from "~/api/config.ts";

export const getProducts = async () => {
    try {
        return await $fetch(`${getApiUrl()}/Product`, {
            method: 'GET',
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при получении списка продуктов:", error);
        throw error;
    }
};

export const getProduct = async (id) => {
    try {
        return await $fetch(`${getApiUrl()}/Product/${id}`, {
            method: 'GET',
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при получении данных продукта:", error);
        throw error;
    }
};

export const createProduct = async (data) => {
    try {
        return await $fetch(`${getApiUrl()}/Product`, {
            method: 'POST',
            body: data,
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при создании продукта:", error);
        throw error;
    }
};

export const editProduct = async (id, data) => {
    try {
        return await $fetch(`${getApiUrl()}/Product/${id}`, {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при редактировании продукта:", error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        return await $fetch(`${getApiUrl()}/Product/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при удалении продукта:", error);
        throw error;
    }
};
