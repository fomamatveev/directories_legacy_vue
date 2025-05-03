import {getApiUrl} from "~/api/config.js";

export const generateQRCode = async ({name, quantity}) => {
    try {
        return await $fetch(`${getApiUrl()}/QrCode/generate`, {
            method: 'POST',
            body: {name, quantity},
            credentials: 'include',
        });
    } catch (error) {
        console.error("Ошибка при генерации QR-кода:", error);
        throw error;
    }
};
