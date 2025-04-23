import { api } from './api';

export interface Sensor {
    id: string | undefined,
    ticketTitle: string,
    ticketDescription: string,
    priority: number,
    resolveDaysCount: number,
    processId: string
}

export const getSensors = async (): Promise<Sensor[]> => {
    try {
        const response = await api.get<{ sensors: Sensor[] }>('/sensors/api/v1/sensors');
        return response.data.sensors;
    } catch (error) {
        console.error('Ошибка при получении датчиков:', error);
        throw error;
    }
};

export const getSensorById = async (id: string): Promise<Sensor> => {
    try {
        const response = await api.get<Sensor>(`/sensors/api/v1/sensors/${id}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении датчика:', error);
        throw error;
    }
};

export const updateSensor = async (sensor: Sensor): Promise<Sensor> => {
    try {
        const response = await api.put<Sensor>(`/sensors/api/v1/sensors/${sensor.id}`, sensor);
        return response.data;
    } catch (error) {
        console.error('Ошибка при обновлении датчика:', error);
        throw error;
    }
};

export const createSensor = async (sensor: Omit<Sensor, 'id'>): Promise<Sensor> => {
    try {
        const response = await api.post<Sensor>('/sensors/api/v1/sensors', sensor);
        return response.data;
    } catch (error) {
        console.error('Ошибка при создании датчика:', error);
        throw error;
    }
}; 