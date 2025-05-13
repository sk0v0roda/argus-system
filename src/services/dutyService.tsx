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

interface DutyResponse {
    id: number;
    start_time: string;
    interval: string;
    name: string;
    ids: number[];
    currentDutyUserId: number;
}

interface DutyRequest {
    id?: number;
    start_time: string;
    name: string;
    interval: string;
    ids: number[];
}

const parseInterval = (interval: string): Duty['interval'] => {
    // Пример: "PT8H" -> 8 часов
    const hours = parseInt(interval.replace('PT', '').replace('H', ''));
    return {
        seconds: hours * 3600,
        zero: false,
        nano: 0,
        negative: false,
        positive: true,
        units: [
            {
                durationEstimated: false,
                timeBased: true,
                dateBased: false
            }
        ]
    };
};

const formatInterval = (interval: Duty['interval']): string => {
    const hours = interval.seconds / 3600;
    return `PT${hours}H`;
};

export const getDuties = async (): Promise<Duty[]> => {
    try {
        const response = await api.get<DutyResponse[]>('/duties/duties');
        return response.data.map(duty => ({
            ...duty,
            interval: parseInterval(duty.interval)
        }));
    } catch (error) {
        console.error('Ошибка при получении дежурств:', error);
        throw error;
    }
};

export const getDutyById = async (id: number): Promise<Duty> => {
    try {
        const response = await api.get<DutyResponse>(`/duties/duties/${id}`);
        return {
            ...response.data,
            interval: parseInterval(response.data.interval)
        };
    } catch (error) {
        console.error('Ошибка при получении дежурства:', error);
        throw error;
    }
};

export const updateDuty = async (duty: Duty): Promise<Duty> => {
    try {
        const response = await api.put<DutyResponse>('/duties/duties', {
            ...duty,
            interval: formatInterval(duty.interval)
        } as DutyRequest);
        return {
            ...response.data,
            interval: parseInterval(response.data.interval)
        };
    } catch (error) {
        console.error('Ошибка при обновлении дежурства:', error);
        throw error;
    }
};

export const createDuty = async (duty: Omit<Duty, 'id'>): Promise<Duty> => {
    try {
        const response = await api.post<DutyResponse>('/duties/duties', {
            ...duty,
            interval: formatInterval(duty.interval)
        } as DutyRequest);
        return {
            ...response.data,
            interval: parseInterval(response.data.interval)
        };
    } catch (error) {
        console.error('Ошибка при создании дежурства:', error);
        throw error;
    }
}; 