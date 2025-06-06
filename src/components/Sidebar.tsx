import React from 'react';
import { Container } from "react-bootstrap";
import NavbarButton from "./NavbarButton";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setTheme } from '../store/slices/themeSlice';

const Sidebar: React.FC = () => {
    const dispatch = useDispatch();
    const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);

    return (
        <Container className={'sidebar-container'}>
            <div className={'nav-logo-placeholder'}>
                <div className={'nav-argus-icon'}>
                </div>
            </div>
            <div className={'navbar-header'}>
                <div className={'navbar-header-title'}>Навигация</div>
                <button className={'theme-button'} onClick={() => dispatch(setTheme(!isDarkTheme))}>
                    <div className={isDarkTheme ? 'navbar-icon-sun' : 'navbar-icon-moon'}></div>
                </button>
            </div>
            <div className={'navbar-tabs'}>
                <NavbarButton iconClass={'navbar-icon-house'} name={'Главная'} to={'/'}></NavbarButton>
                <NavbarButton iconClass={'navbar-icon-graph'} name={'Графы'} to={'/statusgraphs'}></NavbarButton>
                <NavbarButton iconClass={'navbar-icon-sensors'} name={'Датчики'} to={'/sensors'}></NavbarButton>
                <NavbarButton iconClass={'navbar-icon-people'} name={'Дежурства'} to={'/duties'}></NavbarButton>
                <NavbarButton iconClass={'navbar-icon-notifications'} name={'Статусы'} to={'/statuses'}></NavbarButton>
                <NavbarButton iconClass={'navbar-icon-process'} name={'Процессы'} to={'/processes'}></NavbarButton>
            </div>
        </Container>
    );
};

export default Sidebar;