import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import Layout from "src/components/Layout";
import DashboardCard from "src/components/ui/DashboardCard";

const DashboardPage = () => {

    return (
        <Layout>
            <div className={'page-header'}>
                <h1>Дашборд</h1>
                <h2>Эффективное управление задачами, мониторинг датчиков и организация дежурств в одном месте</h2>
            </div>
            <div className={'dashboard-panel'}>
                <DashboardCard to={'/statusgraphs'} name={'Графы статусов'} icon={'🔀'}
                               desc={'Управление графами статусов'}></DashboardCard>
                <DashboardCard to={'/sensors'} name={'Датчики'} icon={'📊'}
                               desc={'Мониторинг и управление датчиками'}></DashboardCard>
                <DashboardCard to={'/duty'} name={'Дежурства'} icon={'👥'}
                               desc={'Организация смен и управление дежурствами'}></DashboardCard>
                <DashboardCard to={'/notifications'} name={'Уведомления'} icon={'🔔'}
                               desc={'Управление уведомлениями'}></DashboardCard>
            </div>
        </Layout>
    );
};
export default DashboardPage;
