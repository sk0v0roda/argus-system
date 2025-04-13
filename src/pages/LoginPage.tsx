import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { setTheme } from '../store/slices/themeSlice';
import { login as loginService } from '../services/userService';
import { login } from '../store/slices/authSlice';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            const response = await loginService(email, password);
            dispatch(login({ email, token: response.token }));
            navigate('/');
        } catch (err) {
            setError('Ошибка входа. Проверьте email и пароль.');
        }
    };

    return (
        <div className="login-container">
            <div className={'login-logo'}></div>
            <div className={'login-title'}>Аргус</div>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <button type="button" className="register-button" onClick={() => navigate('/register')}>
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