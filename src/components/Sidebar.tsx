import React from 'react';
import {Container} from "react-bootstrap";
import NavbarButton from "./NavbarButton";

interface SidebarProps {
    setIsDarkTheme: (isDark: boolean) => void; // Проп для изменения темы
    isDarkTheme: boolean;
}
const Sidebar: React.FC<SidebarProps> = ({setIsDarkTheme, isDarkTheme}) => {
    return (
       <Container className={'sidebar-container'}>
           <div className={'nav-logo-placeholder'}>
               <div className={'nav-argus-icon'}>
               </div>
           </div>
           <div
            className={'navbar-header'}
           >
                   <div className={'navbar-header-title'}>Навигация</div>
               <button className={'theme-button'} onClick={() => setIsDarkTheme(!isDarkTheme)}>
                   <div className={isDarkTheme ? 'navbar-icon-sun' : 'navbar-icon-moon'}></div>
               </button>
           </div>
           <div
            className={'navbar-tabs'}
           >
               <NavbarButton iconClass={'navbar-icon-house'} name={'Главная'} to={'/'}></NavbarButton>
               <NavbarButton iconClass={'navbar-icon-graph'} name={'Графы'} to={'/statusgraphs'}></NavbarButton>
               <NavbarButton iconClass={'navbar-icon-sensors'} name={'Датчики'} to={'/sensors'}></NavbarButton>
               <NavbarButton iconClass={'navbar-icon-people'} name={'Дежурства'} to={'/duty'}></NavbarButton>
               <NavbarButton iconClass={'navbar-icon-notifications'} name={'Уведомления'} to={'/notifications'}></NavbarButton>
           </div>
       </Container>
    );
};

export default Sidebar;