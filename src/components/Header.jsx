import React, { useContext, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/Header.css';

const Header = ({ title }) => {
    const { token, login, logout } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = useCallback(() => {
        setIsDropdownOpen(prev => !prev);
    }, []);

    return (
        <header className="app-header">
            {!token ? (
                <div className="brand-title">
                    <h2>MojeFinance</h2>
                </div>
            ) : (
                <div className="header-left">
                    <h1>{title}</h1>
                </div>
            )}

            <div className="header-right">
                {!token ? (
                    <button onClick={login} className="btn-login">
                        Log In
                    </button>
                ) : (
                    <div className="logged-in-actions">
                        <div className="user-profile-wrapper" onClick={toggleDropdown}>
                            <div className="avatar">
                                <img
                                    src={`/avatar/default.png`}
                                    alt="User"
                                    style={{width: '100%', height: '100%', borderRadius: '50%'}}
                                />
                            </div>
                            <span className="username">John Doe</span>
                            <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>

                            {isDropdownOpen && (
                                <div className="profile-dropdown">
                                    <button onClick={logout} className="dropdown-item">
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;