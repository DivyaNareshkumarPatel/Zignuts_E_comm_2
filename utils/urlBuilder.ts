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

    Object.entries(pathParams).forEach(([key, value]) => {
        url = url.replace(`:${key}`, encodeURIComponent(value));
    });

    return url;
};
