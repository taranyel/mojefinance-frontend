import {useEffect, useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import {AuthContext} from '../context/AuthContext';
import '../styles/BankCallback.css';

const BankCallback = () => {
    const [status, setStatus] = useState({type: 'info', text: 'Processing secure connection...'});
    const navigate = useNavigate();
    const {token} = useContext(AuthContext);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');

        if (error) {
            setStatus({type: 'error', text: `Connection Error: ${error}`});
            return;
        }

        if (code && token) {
            axiosClient.get('/api/bank-connection/ceska-sporitelna', {
                params: {code},
                headers: {'Authorization': `Bearer ${token}`}
            })
                .then(() => {
                    setStatus({type: 'success', text: 'Bank connected successfully! Redirecting...'});
                    setTimeout(() => navigate('/'), 2000);
                })
                .catch(err => {
                    const errMsg = err.response?.data?.message || err.message;
                    setStatus({type: 'error', text: `Failed: ${errMsg}`});
                });
        } else if (code && !token) {
            setStatus({type: 'error', text: 'Session expired. Please log in again.'});
        }
    }, [navigate, token]);

    return (
        <div className="callback-container">
            <h2>Integrating Bank...</h2>
            <div className={`status-message status-${status.type}`}>
                {status.text}
            </div>
        </div>
    );
};

export default BankCallback;