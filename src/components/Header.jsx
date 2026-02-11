import React, {useContext, useState} from 'react';
import {AuthContext} from '../context/AuthContext';
import '../styles/Header.css';

const Header = ({title}) => {
    const {token, login, logout} = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

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
                    /* --- GUEST VIEW: Login Button --- */
                    <button onClick={login} className="btn-login">
                        Log In
                    </button>
                ) : (
                    /* --- LOGGED IN VIEW: Language & Profile Dropdown --- */
                    <div className="logged-in-actions">
                        {/* Language Selector matching screenshot */}
                        <div className="lang-selector">
                            <span className="lang-active">EN</span>
                            <span className="lang-option">CZ</span>
                        </div>

                        {/* User Profile Container */}
                        <div className="user-profile-wrapper" onClick={toggleDropdown}>
                            <div className="avatar">
                                <img
                                    src="https://i.pravatar.cc/150?u=john"
                                    alt="User"
                                    style={{width: '100%', height: '100%', borderRadius: '50%'}}
                                />
                            </div>
                            <span className="username">John Doe</span>
                            <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>

                            {/* Dropdown Menu (Hidden by default) */}
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