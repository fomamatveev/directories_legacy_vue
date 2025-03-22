export const getStorageLocations = async () => {
    try {
        const config = useRuntimeConfig();
        return await $fetch(`${config.public.apiBase}/StorageLocation`, {
            method: 'GET',
            credentials: 'include', // Для работы с куки
        });
    } catch (error) {
        console.error("Ошибка при получении мест хранения:", error);
        throw error;
    }
};

export const getStorageLocation = async (id) => {
    try {
        const config = useRuntimeConfig();
        return await $fetch(`${config.public.apiBase}/StorageLocation/${id}`, {
            method: 'GET',
            credentials: 'include', // Для работы с куки
        });
    } catch (error) {
        console.error("Ошибка при получении места хранения:", error);
        throw error;
    }
};

export const createStorageLocation = async (data) => {
    try {
        const config = useRuntimeConfig();
        return await $fetch(`${config.public.apiBase}/StorageLocation`, {
            method: "POST",
            body: data,
            credentials: "include",
        });
    } catch (error) {
        console.error("Ошибка при создании места хранения:", error);
        throw error;
    }
};

export const editStorageLocation = async (id, data) => {
    try {
        const config = useRuntimeConfig();
        return await $fetch(`${config.public.apiBase}/StorageLocation/${id}`, {
            method: "PUT",
            body: data,
            credentials: "include",
        });
    } catch (error) {
        console.error("Ошибка при редактировании места хранения:", error);
        throw error;
    }
};

export const deleteStorageLocation = async (id) => {
    try {
        const config = useRuntimeConfig();
        return await $fetch(`${config.public.apiBase}/StorageLocation/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
    } catch (error) {
        console.error("Ошибка при удалении места хранения:", error);
        throw error;
    }
};
