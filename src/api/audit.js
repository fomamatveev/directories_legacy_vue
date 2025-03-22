export const getActions = async () => {
    try {
        const config = useRuntimeConfig();
        return await $fetch(`${config.public.apiBase}/Audit`, {
            method: 'GET',
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при получении списка продуктов:", error);
        throw error;
    }
};