import { api } from './api';

export interface Duty {
    id?: number;
    start_time: string;
    name: string;
    interval: {
        seconds: number;
        zero: boolean;
        nano: number;
        negative: boolean;
        positive: boolean;
        units: {
            durationEstimated: boolean;
            timeBased: boolean;
            dateBased: boolean;
        }[];
    };
    ids: number[];
    currentDutyUserId?: number;
}

export const getDuties = async (): Promise<Duty[]> => {
    try {
        const response = await api.get<Duty[]>('/duties/api/v1/duties');
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении дежурств:', error);
        throw error;
    }
};

export const getDutyById = async (id: number): Promise<Duty> => {
    try {
        const response = await api.get<Duty>(`/duties/api/v1/duties/${id}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении дежурства:', error);
        throw error;
    }
};

export const updateDuty = async (duty: Duty): Promise<Duty> => {
    try {
        const response = await api.put<Duty>(`/duties/api/v1/duties/${duty.id}`, duty);
        return response.data;
    } catch (error) {
        console.error('Ошибка при обновлении дежурства:', error);
        throw error;
    }
};

export const createDuty = async (duty: Omit<Duty, 'id'>): Promise<Duty> => {
    try {
        const response = await api.post<Duty>('/duties/api/v1/duties', duty);
        return response.data;
    } catch (error) {
        console.error('Ошибка при создании дежурства:', error);
        throw error;
    }
}; 