export const getProducts = async () => {
    const { $axios } = useNuxtApp();

    try {
        return await $axios.get('/Product'); // Возвращаем ответ с данными
    } catch (error) {
        console.error("Ошибка при получении данных мест хранения:", error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};

export const getProduct = async (id) => {
    const { $axios } = useNuxtApp();

    try {
        return await $axios.get(`/Product/${id}`); // Возвращаем данные конкретного мест хранения
    } catch (error) {
        console.error("Ошибка при получении данных для мест хранения:", error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};

export const createProduct = async (data) => {
    const { $axios } = useNuxtApp();

    try {
        return await $axios.post('/Product', data); // Возвращаем результат создания
    } catch (error) {
        console.error("Ошибка при создании мест хранения:", error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};

export const editProduct = async (id, data) => {
    const { $axios } = useNuxtApp();

    try {
        return await $axios.put(`/Product/${id}`, data); // Возвращаем результат редактирования
    } catch (error) {
        console.error("Ошибка при редактировании мест хранения:", error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};

export const deleteProduct = async (id) => {
    const { $axios } = useNuxtApp();

    try {
        return await $axios.delete(`/Product/${id}`); // Возвращаем результат удаления
    } catch (error) {
        console.error("Ошибка при удалении мест хранения:", error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};
