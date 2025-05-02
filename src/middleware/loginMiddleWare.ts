import type { RouteLocationNormalizedGeneric } from "#vue-router";
import { navigateTo } from "#app";
import { useAuthState } from "~/api/auth2";

export function authMiddleware(needAuth: boolean) {
    return async function (to: RouteLocationNormalizedGeneric, from: RouteLocationNormalizedGeneric) {
        const auth = useAuthState();
        if (auth.isAuthenticated !== needAuth && from.redirectedFrom !== undefined) {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const redirectPath = isMobile ? '/mobile/storage-location' : '/dashboard';
            return navigateTo(redirectPath);
        }
    };
}
