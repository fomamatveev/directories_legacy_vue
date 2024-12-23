export const getProductTypes = async () => {
    const { $axios } = useNuxtApp();

    try {
        return await $axios.get('/ProductType'); // Возвращаем ответ с данными
    } catch (error) {
        console.error("Ошибка при получении данных мест хранения:", error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};

export const getProductType = async (id) => {
    const { $axios } = useNuxtApp();

    try {
        return await $axios.get(`/ProductType/${id}`); // Возвращаем данные конкретного мест хранения
    } catch (error) {
        console.error("Ошибка при получении данных для мест хранения:", error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};

export const createProductType = async (data) => {
    const { $axios } = useNuxtApp();

    try {
        return await $axios.post('/ProductType', data); // Возвращаем результат создания
    } catch (error) {
        console.error("Ошибка при создании мест хранения:", error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};

export const editProductType = async (id, data) => {
    const { $axios } = useNuxtApp();

    try {
        return await $axios.put(`/ProductType/${id}`, data); // Возвращаем результат редактирования
    } catch (error) {
        console.error("Ошибка при редактировании мест хранения:", error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};

export const deleteProductType = async (id) => {
    const { $axios } = useNuxtApp();

    try {
        return await $axios.delete(`/ProductType/${id}`); // Возвращаем результат удаления
    } catch (error) {
        console.error("Ошибка при удалении мест хранения:", error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};
