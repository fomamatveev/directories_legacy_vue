
import {createGlobalState} from "@vueuse/shared";
import {shallowReactive} from "vue";
import {getMe} from "~/api/auth";

interface AuthState {
    isAuthenticated: boolean;

    load(): Promise<boolean>;
    reset(): void;
}

export const useAuthState = createGlobalState(() => {
    const user = shallowReactive({
        isAuthenticated: false,
        load,
        reset
    });

    reset();

    async function load(): Promise<boolean> {
        try {
            const data = await getMe();

            user.isAuthenticated = data;
            return data;
        } catch (err) {
            console.error("Ошибка получения текущего пользователя", err);
            return false;
        }
    }

    function reset(): void {
        user.isAuthenticated = false;
    }

    return user;
});
