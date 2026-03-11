import axios from 'axios';
import {API_CONFIG, HTTP_STATUS, HTTP_HEADERS} from '../constants';
import {getAccessToken} from '../utils';

const axiosClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        [HTTP_HEADERS.CONTENT_TYPE]: HTTP_HEADERS.CONTENT_TYPE_JSON,
    },
});

let authContext = null;

/**
 * Initialize axios client with auth context for token refresh
 */
export const initializeAxiosWithAuth = (context) => {
    authContext = context;
};

/**
 * Request interceptor - adds auth token to all requests
 */
axiosClient.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers[HTTP_HEADERS.AUTHORIZATION] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response interceptor - handles 401 errors and token refresh
 */
axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
            originalRequest._retry = true;

            if (authContext?.checkAndRefreshToken) {
                try {
                    const refreshed = await authContext.checkAndRefreshToken();

                    if (refreshed) {
                        const newToken = getAccessToken();
                        originalRequest.headers[HTTP_HEADERS.AUTHORIZATION] = `Bearer ${newToken}`;
                        return axiosClient(originalRequest);
                    } else {
                        // Token refresh failed
                        if (authContext.logout) {
                            authContext.logout();
                        }
                        window.location.href = '/';
                        return Promise.reject(error);
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    if (authContext?.logout) {
                        authContext.logout();
                    }
                    window.location.href = '/';
                    return Promise.reject(refreshError);
                }
            } else {
                // No auth context, logout
                window.location.href = '/';
                return Promise.reject(error);
            }
        }

        // Handle 403 Forbidden
        if (error.response?.status === HTTP_STATUS.FORBIDDEN) {
            console.error('Access forbidden');
        }

        return Promise.reject(error);
    }
);

export default axiosClient;