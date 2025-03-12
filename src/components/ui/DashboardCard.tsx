import React from 'react';
import {Link} from "react-router-dom";

interface DashboardCardProps {
    icon: string; // Иконка
    name: string; // Текст кнопки
    desc: string; // Описание страницы
    to: string; // Путь для роутинга
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, name, to, desc }) => {
    return (
        <Link to={to} className="navbar-button-link">
            <button className="dashboard-card">
                <div className="dashboard-icon">{icon}</div>
                <div className="dashboard-name">{name}</div>
                <div className="dashboard-desc">{desc}</div>
            </button>
        </Link>
    );
};

export default DashboardCard;