import type {RouteLocationNormalizedGeneric} from "#vue-router";
import {abortNavigation, navigateTo} from "#app";
import {useAuthState} from "~/api/auth2";

export function authMiddleware(needAuth: boolean) {
    return async function (to: RouteLocationNormalizedGeneric, from: RouteLocationNormalizedGeneric) {
        const auth = useAuthState();

        if (auth.isAuthenticated !== needAuth) {
            if (!to.redirectedFrom) {
                return navigateTo('/dashboard');
            }

            return abortNavigation();
        }
    };
}