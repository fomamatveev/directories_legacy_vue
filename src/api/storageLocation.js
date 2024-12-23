export const getStorageLocations = async () => {
    const { $axios } = useNuxtApp();

    try {
        return await $axios.get('/StorageLocation'); // Возвращаем ответ с данными
    } catch (error) {
        console.error("Ошибка при получении данных мест хранения:", error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};

export const getStorageLocation = async (id) => {
    const { $axios } = useNuxtApp();

    try {
        return await $axios.get(`/StorageLocation/${id}`); // Возвращаем данные конкретного мест хранения
    } catch (error) {
        console.error("Ошибка при получении данных для мест хранения:", error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};

export const createStorageLocation = async (data) => {
    const { $axios } = useNuxtApp();

    try {
        return await $axios.post('/StorageLocation', data); // Возвращаем результат создания
    } catch (error) {
        console.error("Ошибка при создании мест хранения:", error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};

export const editStorageLocation = async (id, data) => {
    const { $axios } = useNuxtApp();

    try {
        return await $axios.put(`/StorageLocation/${id}`, data); // Возвращаем результат редактирования
    } catch (error) {
        console.error("Ошибка при редактировании мест хранения:", error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};

export const deleteStorageLocation = async (id) => {
    const { $axios } = useNuxtApp();

    try {
        return await $axios.delete(`/StorageLocation/${id}`); // Возвращаем результат удаления
    } catch (error) {
        console.error("Ошибка при удалении мест хранения:", error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};
