import React, {useEffect, useState} from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import NotFoundPage from "../src/pages/NotFoundPage";
import Sidebar from "../src/components/Sidebar";
import {Col, Container, Row} from "react-bootstrap";
import DashboardPage from "../src/pages/DashboardPage";
import TicketsPage from "../src/pages/TicketsPage";
import SensorsPage from "../src/pages/SensorsPage";
import DutyPage from "@/pages/DutyPage";
import NotificationsPage from "@/pages/NotificationsPage";

function App() {
    const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    // При изменении темы обновляем атрибут data-theme
    useEffect(() => {
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        document.documentElement.setAttribute(
            'data-theme',
            isDarkTheme ? 'dark' : 'light'
        );
    }, [isDarkTheme])

    return (
        <Router>
            <Container fluid className="p-0">
                <Row className="g-0">
                    <Col
                        md={2}
                    >
                        <Sidebar setIsDarkTheme={setIsDarkTheme} isDarkTheme={isDarkTheme}/>
                    </Col>
                    <Col
                        md={10}
                    >

                        <Routes>
                            <Route path="/" element={<DashboardPage/>}/>
                            <Route path="/tickets" element={<TicketsPage/>}/>
                            <Route path="/sensors" element={<SensorsPage/>}/>
                            <Route path="/duty" element={<DutyPage/>}/>
                            <Route path="/notifications" element={<NotificationsPage/>}/>
                            <Route path="*" element={<NotFoundPage/>}/>
                        </Routes>
                    </Col>
                </Row>
            </Container>
        </Router>
    );
}

export default App;
