import React, { useEffect, useState, useContext } from 'react'; // 1. Import useContext
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { AuthContext } from '../context/AuthContext'; // 2. Import your AuthContext (adjust path)

const BankCallback = () => {
    const [status, setStatus] = useState('Processing...');
    const navigate = useNavigate();

    // 3. Get the token from context
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');

        if (error) {
            setStatus(`Error: ${error}`);
            return;
        }

        // Only proceed if we have both the bank code AND our user token
        if (code && token) {
            axiosClient.get('/api/bank-connection/ceska-sporitelna', {
                // 4. Correct placement for GET parameters
                params: {
                    code: code
                },
                // 5. Correct Header format
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
                .then(response => {
                    console.log("Bank Connected!", response.data);
                    setStatus('Success! Redirecting...');
                    setTimeout(() => navigate('/dashboard'), 2000);
                })
                .catch(err => {
                    console.error("Exchange Failed", err);
                    setStatus(`Failed: ${err.response?.status || err.message}`);
                });
        } else if (code && !token) {
            // Optional: Handle case where bank returned but user isn't logged in
            console.warn("Got bank code but no user token found.");
        }
    }, [navigate, token]); // 6. Add token to dependency array

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>Connecting to Bank...</h2>
            <p>{status}</p>
        </div>
    );
};

export default BankCallback;