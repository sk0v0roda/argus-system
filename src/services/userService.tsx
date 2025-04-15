import { api } from './api';

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    // Временно используем моковый токен
    // const response = await api.post('/api/v1/auth/token', {
    //     email,
    //     password
    // });
    // return response.data as LoginResponse;
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJuYmYiOjE3NDQ3MzY2NDUsImV4cCI6MTc0NTM0MTQ0NSwiaWF0IjoxNzQ0NzM2NjQ1fQ.3sjpzRxN0HRyniFpvMIoMN-ZaL41s62J4nAwLrMlNNA"
            });
        }, 1000);
    });
};

export const getUsers = (): Promise<User[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    name: 'Иван Иванов',
                    email: 'ivan@example.com',
                    role: 'Администратор'
                },
                {
                    id: 2,
                    name: 'Петр Петров',
                    email: 'petr@example.com',
                    role: 'Оператор'
                },
                {
                    id: 3,
                    name: 'Сергей Сергеев',
                    email: 'sergey@example.com',
                    role: 'Оператор'
                },
                {
                    id: 4,
                    name: 'Анна Аннова',
                    email: 'anna@example.com',
                    role: 'Менеджер'
                },
                {
                    id: 5,
                    name: 'Мария Мариева',
                    email: 'maria@example.com',
                    role: 'Оператор'
                }
            ]);
        }, 1000);
    });
};

export const getUserById = (id: number): Promise<User> => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            const list = await getUsers();
            resolve(
                list.filter(x => x.id === id)[0]
            );
        }, 250);
    });
}; 