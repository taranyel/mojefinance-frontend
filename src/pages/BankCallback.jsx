import {useEffect, useState, useContext, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import {AuthContext} from '../context/AuthContext';
import {routeCallbackProcessing} from '../services';
import {ROUTES, UI_CONFIG} from '../constants';
import '../styles/BankCallback.css';

const BankCallback = () => {
    const [status, setStatus] = useState({
        type: 'info',
        text: 'Processing secure connection...',
    });

    const navigate = useNavigate();
    const {token} = useContext(AuthContext);
    const processedRef = useRef(false);

    useEffect(() => {
        if (processedRef.current) {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const bankId = sessionStorage.getItem('selectedBank');
        const error = params.get('error');

        const handleError = (message) => {
            setStatus({type: 'error', text: message});
        };

        const handleSuccess = () => {
            setStatus({
                type: 'success',
                text: 'Bank connected successfully! Redirecting...',
            });
            sessionStorage.removeItem('selectedBank');
            setTimeout(() => navigate(ROUTES.BANKS), UI_CONFIG.CONFIRMATION_TIMEOUT);
        };

        if (error) {
            handleError(`Connection Error: ${error}`);
            return;
        }

        if (code && token && bankId) {
            processedRef.current = true;
            routeCallbackProcessing(bankId, code, axiosClient, token)
                .then(handleSuccess)
                .catch((err) => {
                    const errMsg = err.response?.data?.message || err.message;
                    handleError(`Failed: ${errMsg}`);
                    sessionStorage.removeItem('selectedBank');
                });
        } else if (code && !token) {
            handleError('Session expired. Please log in again.');
        } else if (code && !bankId) {
            handleError('Bank information missing. Please try again.');
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

