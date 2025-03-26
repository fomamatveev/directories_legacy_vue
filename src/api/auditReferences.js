export const getProductTypeForAudit = async (id) => {
    try {
        const config = useRuntimeConfig();
        return await $fetch(`${config.public.apiBase}/ProductType/for-audit/${id}`, {
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
        return await $fetch(`${config.public.apiBase}/StorageLocation/for-audit/${id}`, {
            method: 'GET',
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при получении типа продукта:", error);
        throw error;
    }
};

