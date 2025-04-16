import { api } from './api';

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
                    name: "Иван Иванов",
                    email: "ivan@example.com",
                    phone: "+79123456789",
                    organization: null,
                    avatar: "https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000",
                    about: "hey I'm using Argus"
                },
                {
                    id: 2,
                    name: "Степан Пономарев",
                    email: "stepa@mail.ru",
                    phone: "+79150041133",
                    organization: null,
                    avatar: "https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000",
                    about: "hey I'm using Argus"
                },
                {
                    id: 3,
                    name: "Егор Фортов",
                    email: "egor@mail.ru",
                    phone: "+79882213123",
                    organization: null,
                    avatar: "https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000",
                    about: "hey I'm using Argus"
                },
                {
                    id: 4,
                    name: "Андрей Шарипов",
                    email: "andrey@mail.ru",
                    phone: "+79852682144",
                    organization: null,
                    avatar: "https://img.icons8.com/?size=100&id=z-JBA_KtSkxG&format=png&color=000000",
                    about: "hey I'm using Argus"
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