import axios from 'axios';

const API_BASE_URL = 'http://158.160.133.19:5000/proxy';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Добавляем перехватчик для обработки ошибок
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export const getApiUrl = (controller: string, service: string): string => {
    return `${controller}/api/v1/${service}`;
}; 