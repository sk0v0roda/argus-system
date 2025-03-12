import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    setIsDarkTheme: (isDark: boolean) => void; // Проп для изменения темы
    isDarkTheme: boolean;
}
const LoginPage = ({ onLogin, setIsDarkTheme, isDarkTheme }: { onLogin: (username: string) => void, setIsDarkTheme: (isDark: boolean) => void, isDarkTheme: boolean }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
    const [touched, setTouched] = useState<{ username: boolean; password: boolean }>({
        username: false,
        password: false,
    });
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors: { username?: string; password?: string } = {};

        if (!username.trim()) {
            newErrors.username = 'Логин обязателен';
        }

        if (!password) {
            newErrors.password = 'Пароль обязателен';
        } else if (password.length < 8 || password.length > 40) {
            newErrors.password = 'Пароль должен быть от 8 до 40 символов';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ username: true, password: true });

        if (validateForm()) {
            setTimeout(() => {
                onLogin(username);
                navigate('/');
            }, 500)
        }
    };

    useEffect(() => {
        if (touched.username || touched.password) {
            validateForm();
        }
    }, [username, password, touched]);


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
                        onBlur={() => setTouched(prev => ({ ...prev, username: true }))}
                        className={errors.username ? 'error' : ''}
                    />
                </div>

                {touched.username && errors.username && (
                    <div className="error-message">{errors.username}</div>
                )}
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                        className={errors.password ? 'error' : ''}
                    />
                </div>
                {touched.password && errors.password && (
                    <div className="error-message">{errors.password}</div>
                )}
                <button
                    type="submit"
                    className="login-button"
                    disabled={!!errors.username || !!errors.password}
                >
                    Войти
                </button>
                <button
                    type="button"
                    className="register-button"
                >
                    Зарегистрироваться
                </button>
                <button className={'theme-button'} onClick={(e) => {
                    e.preventDefault()
                    setIsDarkTheme(!isDarkTheme)
                }}>
                    <div className={isDarkTheme ? 'navbar-icon-sun' : 'navbar-icon-moon'}></div>
                </button>
            </form>
        </div>
    );
};

export default LoginPage;