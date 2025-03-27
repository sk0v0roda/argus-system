import React from 'react';
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
import RegisterPage from "../src/pages/RegisterPage";
import NotificationsPage from "../src/pages/NotificationsPage";
import { Navigate, Outlet } from 'react-router-dom';
import GraphDetailsPage from "../src/pages/GraphDetailsPage";
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/store';
import { logout, login } from './store/slices/authSlice';

const ProtectedRoute = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function AppContent() {
    const dispatch = useDispatch();
    const username = useSelector((state: RootState) => state.auth.username);

    const handleLogin = (username: string) => {
        dispatch(login(username));
    };

    const handleRegister = (username: string, password: string, confirmPassword: string) => {
        // Здесь будет логика регистрации
        // Пока просто логиним пользователя
        dispatch(login(username));
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <Container fluid className="p-0">
            <Routes>
                <Route path="/login" element={
                    <LoginPage onLogin={handleLogin} />
                } />
                <Route path="/register" element={
                    <RegisterPage onRegister={handleRegister} />
                } />

                <Route element={<ProtectedRoute />}>
                    <Route element={
                        <Row className="g-0">
                            <Col md={2}>
                                <Sidebar />
                            </Col>
                            <Col md={10}>
                                <div className={'profile-bar'}>
                                    <div className={'profile-picture-placeholder'}>
                                        <div className={'profile-picture'}></div>
                                    </div>
                                    <div className={'username'}>
                                        {username || 'Гость'}
                                    </div>
                                    <button onClick={handleLogout}>
                                        <div className={'logout-button'}>Выйти</div>
                                    </button>
                                </div>
                                <Outlet />
                            </Col>
                        </Row>
                    }>
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
    );
}

function App() {
    return (
        <Provider store={store}>
            <Router>
                <AppContent />
            </Router>
        </Provider>
    );
}

export default App;
