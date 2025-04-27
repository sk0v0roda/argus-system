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
import DutyDetailsPage from "../src/pages/DutyDetailsPage";
import LoginPage from "../src/pages/LoginPage";
import RegisterPage from "../src/pages/RegisterPage";
import StatusPage from "../src/pages/StatusPage";
import StatusDetailsPage from "../src/pages/StatusDetailsPage";
import { Navigate, Outlet } from 'react-router-dom';
import GraphDetailsPage from "../src/pages/GraphDetailsPage";
import SensorDetailsPage from "../src/pages/SensorDetailsPage";
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/store';
import { logout, login } from './store/slices/authSlice';
import ProcessPage from '../src/pages/ProcessPage';
import ProcessCreatePage from '../src/pages/ProcessCreatePage';
import ProcessDetailsPage from './pages/ProcessDetailsPage';

const ProtectedRoute = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function AppContent() {
    const dispatch = useDispatch();
    const email = useSelector((state: RootState) => state.auth.email);

    const handleLogin = (email: string, token: string) => {
        dispatch(login({ email, token }));
    };

    const handleRegister = (email: string, password: string, confirmPassword: string) => {
        // Здесь будет логика регистрации
        // Пока просто логиним пользователя
        dispatch(login({ email, token: 'temp_token' }));
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <Container fluid className="p-0">
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage onRegister={handleRegister} />} />

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
                                        {email ? email.split('@')[0] : 'Гость'}
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
                        <Route path="/statusgraphs/new" element={<GraphDetailsPage/>}/>
                        <Route path="/statusgraphs/:id" element={<GraphDetailsPage/>}/>
                        <Route path="/sensors" element={<SensorsPage/>}/>
                        <Route path="/sensors/new" element={<SensorDetailsPage/>}/>
                        <Route path="/sensors/:id" element={<SensorDetailsPage/>}/>
                        <Route path="/duties" element={<DutyPage/>}/>
                        <Route path="/duties/new" element={<DutyDetailsPage/>}/>
                        <Route path="/duties/:id" element={<DutyDetailsPage/>}/>
                        <Route path="/statuses" element={<StatusPage/>}/>
                        <Route path="/statuses/new" element={<StatusDetailsPage/>}/>
                        <Route path="/statuses/:id" element={<StatusDetailsPage/>}/>
                        <Route path="/graphs" element={<GraphStatusPage/>}/>
                        <Route path="/graphs/new" element={<GraphDetailsPage/>}/>
                        <Route path="/graphs/:id" element={<GraphDetailsPage/>}/>
                        <Route path="/processes" element={<ProcessPage/>}/>
                        <Route path="/processes/new" element={<ProcessCreatePage/>}/>
                        <Route path="/processes/:id" element={<ProcessDetailsPage/>}/>
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
