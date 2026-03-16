import React, {useContext, useEffect} from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Banks from './pages/Banks';
import Accounts from './pages/Accounts';
import BankCallback from './pages/BankCallback';
import {AuthContext} from './context/AuthContext';
import {initializeAxiosWithAuth} from './api/axiosClient';
import './styles/App.css';

function App() {
    const authContext = useContext(AuthContext);
    const {token} = authContext;

    // Initialize axios with auth context for token refresh
    useEffect(() => {
        initializeAxiosWithAuth(authContext);
    }, [authContext]);

    return (
        <BrowserRouter>
            <div className="layout-wrapper">
                {token && <Sidebar/>}

                <div className="main-content-area">
                    <div className="page-content">
                        <Routes>
                            <Route path="/" element={
                                token ? (
                                    <>
                                        <Header title="Dashboard"/>
                                        <Dashboard/>
                                    </>
                                ) : (
                                    <>
                                        <Header title="MojeFinance"/>
                                        <LandingPage/>
                                    </>
                                )
                            }/>

                            <Route path="/banks" element={
                                token ? (
                                    <>
                                        <Header title="Banks Overview"/>
                                        <Banks/>
                                    </>
                                ) : <Navigate to="/"/>
                            }/>

                            <Route path="/accounts" element={
                                token ? (
                                    <>
                                        <Header title="Accounts Overview"/>
                                        <Accounts/>
                                    </>
                                ) : <Navigate to="/"/>
                            }/>

                            <Route path="/bank-callback" element={<BankCallback/>}/>

                            <Route path="*" element={<Navigate to="/"/>}/>
                        </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;