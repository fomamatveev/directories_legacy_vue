export const getProductTypes = async () => {
    try {
        const config = useRuntimeConfig();
        return await $fetch(`${config.public.apiBase}/ProductType`, {
            method: 'GET',
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при получении типов продуктов:", error);
        throw error;
    }
};

export const getProductType = async (id) => {
    try {
        const config = useRuntimeConfig();
        return await $fetch(`${config.public.apiBase}/ProductType/${id}`, {
            method: 'GET',
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при получении типа продукта:", error);
        throw error;
    }
};

export const createProductType = async (data) => {
    try {
        const config = useRuntimeConfig();
        return await $fetch(`${config.public.apiBase}/ProductType`, {
            method: 'POST',
            body: data,
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при создании типа продукта:", error);
        throw error;
    }
};

export const editProductType = async (id, data) => {
    try {
        const config = useRuntimeConfig();
        return await $fetch(`${config.public.apiBase}/ProductType/${id}`, {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при редактировании типа продукта:", error);
        throw error;
    }
};

export const deleteProductType = async (id) => {
    try {
        const config = useRuntimeConfig();
        return await $fetch(`${config.public.apiBase}/ProductType/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при удалении типа продукта:", error);
        throw error;
    }
};