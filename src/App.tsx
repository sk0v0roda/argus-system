import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import NotFoundPage from "../src/pages/NotFoundPage";
import Sidebar from "../src/components/Sidebar";
import {Col, Container, Row} from "react-bootstrap";
import DashboardPage from "../src/pages/DashboardPage";
import GraphStatusPage from "./pages/GraphStatusPage";
import SensorsPage from "../src/pages/SensorsPage";
import DutyPage from "../src/pages/DutyPage";
import LoginPage from "../src/pages/LoginPage";
import NotificationsPage from "../src/pages/NotificationsPage";
import { Navigate, Outlet } from 'react-router-dom';
import GraphDetailsPage from "../src/pages/GraphDetailsPage";

const ProtectedRoute = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};


function App() {
    const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return true;
    });

    const handleLogin = (username: string) => {
        localStorage.setItem('authToken', 'example_token');
        localStorage.setItem('username', username);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
    };

    useEffect(() => {
        document.documentElement.setAttribute(
            'data-theme',
            isDarkTheme ? 'dark' : 'light'
        );
    }, [isDarkTheme]);

    return (
        <Router>
            <Container fluid className="p-0">
                <Routes>
                    <Route path="/login" element={<LoginPage onLogin={handleLogin} setIsDarkTheme={setIsDarkTheme} isDarkTheme={isDarkTheme} />} />

                    {/* Защищенные маршруты */}
                    <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                        <Route element={ // Общий layout для защищенных страниц
                            <Row className="g-0">
                                <Col md={2}>
                                    <Sidebar setIsDarkTheme={setIsDarkTheme} isDarkTheme={isDarkTheme}/>
                                </Col>
                                <Col md={10}>
                                    <div className={'profile-bar'}>
                                        <div className={'profile-picture-placeholder'}>
                                            <div className={'profile-picture'}></div>
                                        </div>
                                        <div className={'username'}>
                                            {localStorage.getItem('username') || 'Гость'}
                                        </div>
                                        <button onClick={handleLogout}>
                                            <div className={'logout-button'}>Выйти</div>
                                        </button>
                                    </div>
                                    {/* Здесь должен быть Outlet для вложенных маршрутов */}
                                    <Outlet />
                                </Col>
                            </Row>
                        }>
                            {/* Вложенные маршруты */}
                            <Route path="/" element={<DashboardPage/>}/>
                            <Route path="/statusgraphs" element={<GraphStatusPage/>}/>
                            <Route path="/statusgraphs/:id" element={<GraphDetailsPage/>}/>
                            <Route path="/sensors" element={<SensorsPage/>}/>
                            <Route path="/duty" element={<DutyPage/>}/>
                            <Route path="/notifications" element={<NotificationsPage/>}/>
                            <Route path="*" element={<NotFoundPage/>}/>
                        </Route>
                    </Route>
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
