import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

const CLIENT_ID = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_APP_URL + '/';
const AUTH_ENDPOINT = import.meta.env.VITE_KEYCLOAK_AUTH_URL;
const TOKEN_ENDPOINT = import.meta.env.VITE_KEYCLOAK_TOKEN_URL;

export const AuthProvider = ({ children }) => {
    // Initialize token from localStorage safely
    const [token, setToken] = useState(() => localStorage.getItem('access_token'));

    const login = () => {
        console.log("Attempting login...");

        if (!AUTH_ENDPOINT || !CLIENT_ID) {
            console.error("Missing Env Vars:", { AUTH_ENDPOINT, CLIENT_ID });
            alert("Configuration missing! Please check your .env file and restart the server.");
            return;
        }

        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            response_type: 'code',
            redirect_uri: REDIRECT_URI,
            scope: 'openid profile email',
        });

        const fullUrl = `${AUTH_ENDPOINT}?${params.toString()}`;
        console.log("Redirecting to:", fullUrl);

        window.location.href = fullUrl;
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('access_token');
        window.history.pushState({}, document.title, "/");
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code && !token) {
            window.history.replaceState({}, document.title, "/");

            fetch(TOKEN_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: CLIENT_ID,
                    code: code,
                    redirect_uri: REDIRECT_URI,
                }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.access_token) {
                        setToken(data.access_token);
                        localStorage.setItem('access_token', data.access_token);
                        console.log(data.access_token)
                    } else {
                        console.error("Token exchange failed:", data);
                    }
                })
                .catch(err => console.error("Auth Error:", err));
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};