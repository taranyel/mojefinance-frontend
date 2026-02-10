import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // 1. Import Router
import ConnectBank from './pages/ConnectBank';
import BankCallback from './pages/BankCallback';
import { AuthContext } from './context/AuthContext';

function App() {
    const { login, logout, token } = useContext(AuthContext);

    return (
        // 2. Wrap the entire app in Router so we can navigate between pages
        <BrowserRouter>
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <h1>Moje Finance App</h1>

                <Routes>
                    {/* Route 1: The Main Dashboard */}
                    <Route path="/" element={
                        !token ? (
                            // CASE A: Not Logged In
                            <div>
                                <p>You are not logged in.</p>
                                <button
                                    onClick={login}
                                    style={{ padding: '10px 20px', fontSize: '1.2em', cursor: 'pointer' }}
                                >
                                    Log In with Keycloak
                                </button>
                            </div>
                        ) : (
                            // CASE B: Logged In (The Dashboard)
                            <div>
                                <h2 style={{ color: 'green' }}>Welcome back!</h2>

                                {/* 3. Add the Connect Bank Button here */}
                                <div style={{ margin: '30px 0' }}>
                                    <ConnectBank />
                                </div>

                                <div style={{ marginTop: '20px', background: '#f0f0f0', padding: '10px' }}>
                                    <strong>Token Snippet:</strong> {token.substring(0, 30)}...
                                </div>

                                <button onClick={logout} style={{ marginTop: '20px' }}>Log Out</button>
                            </div>
                        )
                    } />

                    {/* Route 2: The Callback Handler */}
                    {/* This is where the Bank redirects the user to */}
                    <Route path="/bank-callback" element={<BankCallback />} />

                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;