import { api, authApi } from './api';

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    organization: string | null;
    avatar: string;
    about: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await authApi.post('/api/v1/auth/token', {
        email,
        password
    });
    return response.data as LoginResponse;
};

export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await api.get('/profiles/users/all');
        if (!response.data || !Array.isArray(response.data)) {
            console.error('Ответ API не содержит массив пользователей:', response.data);
            return [];
        }
        return response.data.map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            organization: user.organization || null,
            avatar: user.avatar || "https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000",
            about: user.about || "hey I'm using Argus"
        }));
    } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
        throw error;
    }
};

interface ApiUser {
    id: number;
    name: string;
    email: string;
    phone: string;
    organization: string | null;
    avatar: string | null;
    about: string | null;
}

export const getUserById = async (id: number): Promise<User> => {
    try {
        const response = await api.get<ApiUser>(`/profiles/users/${id}`);
        const user = response.data;
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            organization: user.organization || null,
            avatar: user.avatar || "https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000",
            about: user.about || "hey I'm using Argus"
        };
    } catch (error) {
        console.error('Ошибка при получении пользователя:', error);
        throw error;
    }
};

interface RegisterRequest {
    name: string;
    email: string;
    phone: string;
    password: string;
}

export const register = async (userData: RegisterRequest): Promise<User> => {
    try {
        const response = await api.post<User>('/profiles/users', userData);
        return response.data;
    } catch (error) {
        console.error('Ошибка при регистрации пользователя:', error);
        throw error;
    }
}; 