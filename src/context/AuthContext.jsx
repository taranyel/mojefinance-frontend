import {createContext, useState, useEffect, useCallback} from 'react';
import {ERROR_MESSAGES} from '../constants';
import {isTokenExpired} from '../utils';
import {getAccessToken, getRefreshToken, saveAccessToken, saveRefreshToken, clearTokens} from '../utils';
import {
    exchangeCodeForTokens,
    refreshAccessTokenWithRefreshToken,
    validateKeycloakConfig,
    buildAuthorizationUrl,
    buildLogoutUrl
} from '../services';

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(() => getAccessToken());
    const [refreshToken, setRefreshToken] = useState(() => getRefreshToken());
    const [isLoading, setIsLoading] = useState(false);

    const logout = useCallback(() => {
        setToken(null);
        setRefreshToken(null);
        clearTokens();

        let logoutUrl = buildLogoutUrl();
        console.log("Redirecting to:", logoutUrl);
        window.location.href = logoutUrl;
    }, []);

    const login = useCallback(() => {
        console.log("Attempting login...");

        if (!validateKeycloakConfig()) {
            console.error("Invalid Keycloak configuration");
            alert(ERROR_MESSAGES.MISSING_CONFIG);
            return;
        }

        const authUrl = buildAuthorizationUrl();
        console.log("Redirecting to:", authUrl);
        window.location.href = authUrl;
    }, []);

    const refreshAccessToken = useCallback(async () => {
        if (!refreshToken) {
            console.warn(ERROR_MESSAGES.NO_REFRESH_TOKEN);
            logout();
            return false;
        }

        try {
            setIsLoading(true);
            const data = await refreshAccessTokenWithRefreshToken(refreshToken);

            const newAccessToken = data.access_token;
            const newRefreshToken = data.refresh_token || refreshToken;

            setToken(newAccessToken);
            setRefreshToken(newRefreshToken);
            saveAccessToken(newAccessToken);
            saveRefreshToken(newRefreshToken);

            console.log('Token refreshed successfully');
            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [refreshToken, logout]);

    const checkAndRefreshToken = useCallback(async () => {
        if (!token) return false;

        if (isTokenExpired(token)) {
            console.log('Token expired, attempting refresh...');
            return await refreshAccessToken();
        }

        return true;
    }, [token, refreshAccessToken]);

    useEffect(() => {
        if (!token) return;

        const interval = setInterval(() => {
            checkAndRefreshToken();
        }, 30000);

        return () => clearInterval(interval);
    }, [token, checkAndRefreshToken]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code && !token) {
            window.history.replaceState({}, document.title, "/");

            exchangeCodeForTokens(code)
                .then((data) => {
                    const newAccessToken = data.access_token;
                    const newRefreshToken = data.refresh_token;

                    setToken(newAccessToken);
                    saveAccessToken(newAccessToken);

                    if (newRefreshToken) {
                        setRefreshToken(newRefreshToken);
                        saveRefreshToken(newRefreshToken);
                    }

                    console.log('Initial authentication successful');
                })
                .catch((err) => console.error("Auth Error:", err));
        }
    }, [token]);

    const value = {
        token,
        refreshToken,
        login,
        logout,
        checkAndRefreshToken,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



