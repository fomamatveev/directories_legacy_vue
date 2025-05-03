import {getApiUrl} from "~/api/config.js";

export const getProductNameForAudit = async (id) => {
    try {
        const config = useRuntimeConfig();
        return await $fetch(`${getApiUrl()}/ProductName/for-audit/${id}`, {
            method: 'GET',
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при получении позиции:", error);
        throw error;
    }
};

export const getProductTypeForAudit = async (id) => {
    try {
        const config = useRuntimeConfig();
        return await $fetch(`${getApiUrl()}/ProductType/for-audit/${id}`, {
            method: 'GET',
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при получении типа продукта:", error);
        throw error;
    }
};

export const getStorageLocationForAudit = async (id) => {
    try {
        const config = useRuntimeConfig();
        return await $fetch(`${getApiUrl()}/StorageLocation/for-audit/${id}`, {
            method: 'GET',
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при получении типа продукта:", error);
        throw error;
    }
};

