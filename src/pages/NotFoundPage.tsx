import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import Layout from "src/components/Layout";

const NotFoundPage = () => {
    const location = useLocation();
    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            location.pathname
        );
    }, [location.pathname]);

    return (
        <Layout>
            <div className={'d-flex flex-column justify-content-center align-items-center h-100'}>
                <div>
                    <h1>404</h1>
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
export default NotFoundPage;
