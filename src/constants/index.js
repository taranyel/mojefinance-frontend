/**
 * Application-wide Constants
 */

export const KEYCLOAK_CONFIG = {
    CLIENT_ID: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
    AUTH_URL: 'http://localhost:8080/realms/mojefinance/protocol/openid-connect/auth',
    TOKEN_URL: 'http://localhost:8080/realms/mojefinance/protocol/openid-connect/token',
    LOGOUT_URL: 'http://localhost:8080/realms/mojefinance/protocol/openid-connect/logout',
    REDIRECT_URI: 'http://localhost:5173/dashboard',
};

export const API_CONFIG = {
    BASE_URL: '/',
    ENDPOINTS: {
        BANKS: '/api/banks',
        BANK_CONNECT: `/api/banks/connect`,
        BANK_DISCONNECT: (bankId) => `/api/banks/disconnect/${bankId}`,
        PRODUCTS: '/api/products',
        ASSETS_LIABILITIES: '/api/products/assets-liabilities',
        CASH_FLOW: '/api/products/cash-flow',
        BUDGETS: '/api/budgets',
        TRANSACTIONS: (clientRegistrationId, accountId) => `/api/products/${clientRegistrationId}/${accountId}/transactions`
    },
    TIMEOUT: 30000,
};

export const OAUTH_GRANT_TYPES = {
    AUTHORIZATION_CODE: 'authorization_code',
    REFRESH_TOKEN: 'refresh_token',
};

export const OAUTH_RESPONSE_TYPES = {
    CODE: 'code',
};

export const OAUTH_SCOPES = {
    OPENID: 'openid',
    PROFILE: 'profile',
    EMAIL: 'email',
};

export const TOKEN_CONFIG = {
    ACCESS_TOKEN_KEY: 'access_token',
    REFRESH_TOKEN_KEY: 'refresh_token',
    EXPIRATION_BUFFER_MS: 60 * 1000,
    CHECK_INTERVAL_MS: 30 * 1000,
    ID_TOKEN: 'id_token'
};

export const HTTP_HEADERS = {
    CONTENT_TYPE: 'Content-Type',
    CONTENT_TYPE_JSON: 'application/json',
    CONTENT_TYPE_URLENCODED: 'application/x-www-form-urlencoded',
    AUTHORIZATION: 'Authorization',
};

export const HTTP_STATUS = {
    OK: 200,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
};

export const AVAILABLE_BANKS = [
    {
        id: 'ceska-sporitelna',
        name: 'Česká spořitelna',
        logo: 'Š',
        class: 'logo-csas',
        authUrlEnv: 'VITE_CSAS_AUTH_URL',
        clientIdEnv: 'VITE_CSAS_CLIENT_ID',
    },
    {
        id: 'csob',
        name: 'ČSOB',
        logo: 'Č',
        class: 'logo-csob',
        authUrlEnv: 'VITE_CSOB_AUTH_URL',
        clientIdEnv: 'VITE_CSOB_CLIENT_ID',
    },
    {
        id: 'kb',
        name: 'Komerční banka ',
        logo: 'K',
        class: 'logo-kb',
        authUrlEnv: 'VITE_KB_AUTH_URL',
        clientIdEnv: 'VITE_KB_CLIENT_ID',
    },
    {
        id: 'air-bank',
        name: 'Air Bank',
        logo: 'A',
        class: 'logo-airbank',
        authUrlEnv: 'VITE_AIRBANK_AUTH_URL',
        clientIdEnv: 'VITE_AIRBANK_CLIENT_ID',
    },
    {
        id: 'raiffeisen-bank',
        name: 'Raiffeisen Bank',
        logo: 'R',
        class: 'logo-rb',
        authUrlEnv: 'VITE_RB_AUTH_URL',
        clientIdEnv: 'VITE_RB_CLIENT_ID',
    },
];

export const ERROR_MESSAGES = {
    MISSING_CONFIG: 'Configuration missing! Please check your .env file and restart the server.',
    BANK_CONNECTION_FAILED: (bankName) => `Failed to connect to ${bankName}. Please try again.`,
    BANK_DISCONNECTION_FAILED: (bankName) => `Failed to disconnect ${bankName}. Please try again.`,
    DISCONNECT_CONFIRMATION: (bankName) => `Are you sure you want to disconnect ${bankName}?`,
    NO_REFRESH_TOKEN: 'No refresh token available',
    TOKEN_REFRESH_FAILED: 'Token refresh failed',
    TOKEN_EXCHANGE_FAILED: 'Token exchange failed',
};

export const ROUTES = {
    HOME: '/',
    BANKS: '/banks',
    BANK_CALLBACK: '/bank-callback',
    DASHBOARD: '/',
};

export const UI_CONFIG = {
    MODAL_CLOSE_BUTTON: '×',
    CONFIRMATION_TIMEOUT: 2000,
};

