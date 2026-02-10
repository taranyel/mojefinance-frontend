import React, {createContext, useState, useEffect} from 'react';

export const AuthContext = createContext(null);

const CLIENT_ID = 'mojefinance-frontend';
const REDIRECT_URI = 'http://localhost:5173/';
const AUTH_ENDPOINT = 'http://localhost:8080/realms/mojefinance/protocol/openid-connect/auth';
const TOKEN_ENDPOINT = 'http://localhost:8080/realms/mojefinance/protocol/openid-connect/token';

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem('access_token'));

    const login = () => {
        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            response_type: 'code',
            redirect_uri: REDIRECT_URI,
            scope: 'openid profile email',
        });

        window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`;
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');

        if (code && !token) {
            window.history.replaceState({}, document.title, "/");

            fetch(TOKEN_ENDPOINT, {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
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
                    } else {
                        console.error("Token exchange failed:", data);
                    }
                })
                .catch(console.error);
        }
    }, [token]);

    const logout = () => {
        setToken(null);
        localStorage.removeItem('access_token');
    };

    return (
        <AuthContext.Provider value={{token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};