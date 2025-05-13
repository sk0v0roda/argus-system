import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { setTheme } from '../store/slices/themeSlice';
import { register, login } from '../services/userService';
import { login as loginAction } from '../store/slices/authSlice';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name || !email || !phone || !password || !confirmPassword) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        try {
            await register({
                name,
                email,
                phone,
                password
            });
            
            // Автоматический вход после регистрации
            const loginResponse = await login(email, password);
            dispatch(loginAction({ email, token: loginResponse.token }));
            navigate('/');
        } catch (err) {
            setError('Ошибка регистрации. Попробуйте другой email.');
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
                        placeholder="Имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
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
                        type="tel"
                        placeholder="Телефон"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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