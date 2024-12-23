export const login = async (username, password) => {
    const { $axios } = useNuxtApp();  // Получаем $axios через useNuxtApp()

    try {
        const response = await $axios.post('/auth/login', {
            username,
            password,
        });
        return response.data; // Возвращаем данные, если запрос успешен
    } catch (error) {
        console.error('Login error:', error);
        throw error; // Если ошибка, выбрасываем её дальше
    }
};

export const register = async (username, password) => {
    const { $axios } = useNuxtApp();  // Получаем $axios через useNuxtApp()

    try {
        const response = await $axios.post('/auth/register', {
            username,
            password,
        });
        return response.data; // Возвращаем данные, если запрос успешен
    } catch (error) {
        console.error('Registration error:', error);
        throw error; // Если ошибка, выбрасываем её дальше
    }
};

export const logout = async () => {
    const { $axios } = useNuxtApp();  // Получаем $axios через useNuxtApp()

    try {
        const response = await $axios.post('/auth/logout');
        return response.data; // Возвращаем данные, если запрос успешен
    } catch (error) {
        console.error('Logout error:', error);
        throw error; // Если ошибка, выбрасываем её дальше
    }
};
