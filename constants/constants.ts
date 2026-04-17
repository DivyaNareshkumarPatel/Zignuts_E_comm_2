export const API_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export const RESPONSE_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUEST: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
} as const;

export const PUBLIC_PATHS = [
  '/',
  '/auth',
  '/privacy',
  '/terms',
  '/venue',
  '/security',
];

export const RESPONSE_OK = 200;
export const RESPONSE_CREATED = 201;