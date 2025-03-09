import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import Layout from "src/components/Layout";

const SensorsPage = () => {

    return (
        <Layout>
            <div className={'d-flex flex-column justify-content-center align-items-center h-100'}>
                <div>
                    <h1>ДАТЧИКИ</h1>
                </div>
                <div>
                    <p>Ой ! Страница не найдена</p>
                </div>
                <div>
                    <a href="/">На главную страницу</a>
                </div>
            </div>
        </Layout>
    );
};
export default SensorsPage;
