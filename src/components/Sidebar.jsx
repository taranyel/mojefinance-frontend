import React from 'react';
import {NavLink} from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <h2>MojeFinance</h2>
            </div>

            <nav className="sidebar-menu">
                <NavLink
                    to="/"
                    className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}
                    end
                >
                    <span className="icon">🏠</span>
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/transactions"
                    className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}
                >
                    <span className="icon">↔️</span>
                    <span>Transactions</span>
                </NavLink>

                <NavLink
                    to="/accounts"
                    className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}
                >
                    <span className="icon">💳</span>
                    <span>Accounts</span>
                </NavLink>

                <NavLink
                    to="/banks"
                    className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}
                >
                    <span className="icon">🏛️</span>
                    <span>Banks</span>
                </NavLink>

                <div className="menu-item disabled">
                    <span className="icon">📉</span>
                    <span>Budgeting</span>
                </div>
            </nav>

            <div className="sidebar-footer">
                <div className="menu-item">
                    <span className="icon">⚙️</span>
                    <span>Settings</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;