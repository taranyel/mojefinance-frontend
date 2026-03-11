/**
 * OAuth Service
 * Handles Keycloak OAuth2 operations
 */

import {
    KEYCLOAK_CONFIG,
    OAUTH_GRANT_TYPES,
    OAUTH_RESPONSE_TYPES,
    OAUTH_SCOPES,
    HTTP_HEADERS,
    ERROR_MESSAGES,
} from '../constants';

/**
 * Build OAuth authorization URL
 * @returns {string} Authorization URL
 */
export const buildAuthorizationUrl = () => {
    const params = new URLSearchParams({
        client_id: KEYCLOAK_CONFIG.CLIENT_ID,
        response_type: OAUTH_RESPONSE_TYPES.CODE,
        redirect_uri: KEYCLOAK_CONFIG.REDIRECT_URI,
        scope: Object.values(OAUTH_SCOPES).join(' '),
    });

    return `${KEYCLOAK_CONFIG.AUTH_URL}?${params.toString()}`;
};

/**
 * Exchange authorization code for tokens
 * @param {string} code - Authorization code from OAuth provider
 * @returns {Promise<{access_token: string, refresh_token: string}>} Tokens
 */
export const exchangeCodeForTokens = async (code) => {
    try {
        const response = await fetch(KEYCLOAK_CONFIG.TOKEN_URL, {
            method: 'POST',
            headers: {
                [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.CONTENT_TYPE_URLENCODED,
            },
            body: new URLSearchParams({
                grant_type: OAUTH_GRANT_TYPES.AUTHORIZATION_CODE,
                client_id: KEYCLOAK_CONFIG.CLIENT_ID,
                code,
                redirect_uri: KEYCLOAK_CONFIG.REDIRECT_URI,
            }),
        });

        const data = await response.json();

        if (data.access_token) {
            return data;
        }

        throw new Error(ERROR_MESSAGES.TOKEN_EXCHANGE_FAILED);
    } catch (error) {
        console.error('Token exchange error:', error);
        throw error;
    }
};

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<{access_token: string, refresh_token: string}>} New tokens
 */
export const refreshAccessTokenWithRefreshToken = async (refreshToken) => {
    try {
        const response = await fetch(KEYCLOAK_CONFIG.TOKEN_URL, {
            method: 'POST',
            headers: {
                [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.CONTENT_TYPE_URLENCODED,
            },
            body: new URLSearchParams({
                grant_type: OAUTH_GRANT_TYPES.REFRESH_TOKEN,
                client_id: KEYCLOAK_CONFIG.CLIENT_ID,
                refresh_token: refreshToken,
            }),
        });

        const data = await response.json();

        if (data.access_token) {
            return data;
        }

        throw new Error(ERROR_MESSAGES.TOKEN_REFRESH_FAILED);
    } catch (error) {
        console.error('Token refresh error:', error);
        throw error;
    }
};

/**
 * Validate Keycloak configuration
 * @returns {boolean} True if configuration is valid
 */
export const validateKeycloakConfig = () => {
    const {CLIENT_ID, AUTH_URL, TOKEN_URL} = KEYCLOAK_CONFIG;
    return !!(CLIENT_ID && AUTH_URL && TOKEN_URL);
};

