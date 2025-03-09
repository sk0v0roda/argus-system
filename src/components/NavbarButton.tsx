import React from 'react';
import {Link} from "react-router-dom";

interface NavbarButtonProps {
    iconClass: string; // Класс для иконки
    name: string; // Текст кнопки
    to: string; // Путь для роутинга
}

const NavbarButton: React.FC<NavbarButtonProps> = ({ iconClass, name, to }) => {
    return (
        <Link to={to} className="navbar-button-link">
            <button className="navbar-tab">
                <div className={iconClass}></div>
                <div className="navbar-name">{name}</div>
            </button>
        </Link>
    );
};

export default NavbarButton;