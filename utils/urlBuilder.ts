/**
 * Build URL with path parameters replacement
 * @param endpoint - URL endpoint (e.g., '/files/:id')
 * @param pathParams - Object with path parameter values (e.g., { id: '123' })
 * @returns Built URL string
 */
export const buildUrl = (
    endpoint: string,
    pathParams: Record<string, string> = {},
    module: string = 'v1'
): string => {
    const modulePrefix = module
        ? module.startsWith('/')
            ? module
            : `/${module}`
        : '';
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    let url = `${modulePrefix}${cleanEndpoint}`;

    // Replace path parameters
    Object.entries(pathParams).forEach(([key, value]) => {
        url = url.replace(`:${key}`, encodeURIComponent(value));
    });

    return url;
};
