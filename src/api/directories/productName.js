import {getApiUrl} from "~/api/config.ts";

export const getProductNames = async () => {
    try {
        return await $fetch(`${getApiUrl()}/ProductName`, {
            method: 'GET',
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при получении позиции:", error);
        throw error;
    }
};

export const getProductName = async (id) => {
    try {
        return await $fetch(`${getApiUrl()}/ProductName/${id}`, {
            method: 'GET',
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при получении позиции:", error);
        throw error;
    }
};

export const createProductName = async (data) => {
    try {
        return await $fetch(`${getApiUrl()}/ProductName`, {
            method: 'POST',
            body: data,
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при создании позиции:", error);
        throw error;
    }
};

export const editProductName = async (id, data) => {
    try {
        return await $fetch(`${getApiUrl()}/ProductName/${id}`, {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при редактировании позиции:", error);
        throw error;
    }
};

export const deleteProductName = async (id) => {
    try {
        return await $fetch(`${getApiUrl()}/ProductName/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при удалении позиции:", error);
        throw error;
    }
};