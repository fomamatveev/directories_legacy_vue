const useForward = true;

export const getApiUrl = () => {
    const cfg = useRuntimeConfig();

    return !useForward
        ? cfg.public.apiBase
        : cfg.public.apiForward;
};