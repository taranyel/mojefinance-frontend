import React from 'react';
import {NavLink} from 'react-router-dom';
import '../styles/Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowRightArrowLeft, faBuildingColumns, faCreditCard, faHouse, faCoins} from '@fortawesome/free-solid-svg-icons';

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
                    <FontAwesomeIcon icon={faHouse} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink
                    to="/transactions"
                    className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}
                >
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} />
                    <span>Transactions</span>
                </NavLink>

                <NavLink
                    to="/accounts"
                    className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}
                >
                    <FontAwesomeIcon icon={faCreditCard} />
                    <span>Accounts</span>
                </NavLink>

                <NavLink
                    to="/banks"
                    className={({isActive}) => `menu-item ${isActive ? 'active' : ''}`}
                >
                    <FontAwesomeIcon icon={faBuildingColumns} />
                    <span>Banks</span>
                </NavLink>

                <div className="menu-item disabled">
                    <FontAwesomeIcon icon={faCoins} />
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