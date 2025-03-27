import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { setTheme } from '../store/slices/themeSlice';

interface RegisterPageProps {
    onRegister: (username: string, password: string, confirmPassword: string) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !password || !confirmPassword) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            onRegister(username, password, confirmPassword);
            navigate('/');
        } catch (err) {
            setError('Ошибка регистрации. Попробуйте другой логин.');
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
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Подтвердите пароль"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="login-button">
                    Зарегистрироваться
                </button>
                <button type="button" className="register-button" onClick={() => navigate('/login')}>
                    Уже есть аккаунт? Войти
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

export default RegisterPage; 