import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { setTheme } from '../store/slices/themeSlice';

interface LoginPageProps {
    onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            onLogin(username);
            navigate('/');
        } catch (err) {
            setError('Ошибка входа. Проверьте логин и пароль.');
        }
    };

    return (
        <div className="login-container">
            <div className={'login-logo'}></div>
            <div className={'login-title'}>Аргус</div>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Логин"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="login-button">
                    Войти
                </button>
                <button type="button" className="register-button">
                    Зарегистрироваться
                </button>
                <button className={'theme-button'} onClick={(e) => {
                    e.preventDefault();
                    dispatch(setTheme(!isDarkTheme));
                }}>
                    <div className={isDarkTheme ? 'navbar-icon-sun' : 'navbar-icon-moon'}></div>
                </button>
            </form>
        </div>
    );
};

export default LoginPage;