import { api } from './api';

export interface Process {
    id: string,
    name: string,
    description: string,
    graphId: string,
}

export interface ProcessStatus {
    id: string;
    name: string;
    orderNum: number;
    description: string;
    tickets: ProcessTicket[];
}

export interface ProcessTicket {
    id: string;
    name: string;
    priority: number;
    deadline: string;
    executor: {
        id: number;
        name: string;
        avatar: string;
    };
}

export interface TicketComment {
    id: string;
    text: string;
    mentionedUsers: {
        id: number;
        name: string;
        avatar: string;
    }[];
    author: {
        id: number;
        name: string;
        avatar: string;
    };
    createdAt: string;
}

export interface TicketDetails {
    id: string;
    name: string;
    description: string;
    priority: number;
    deadline: string;
    createdAt: string;
    updatedAt: string;
    author: {
        id: number;
        name: string;
        avatar: string;
    };
    executor: {
        id: number;
        name: string;
        avatar: string;
    };
    status: {
        id: string;
        name: string;
        description: string;
        transitions: {
            toStatusId: string;
            name: string;
        }[];
    };
    comments: TicketComment[];
}

export interface ProcessDetails extends Process {
    statuses: ProcessStatus[];
}

export const getProcesses = async (): Promise<Process[]> => {
    try {
        const response = await api.get<{ processes: Process[] }>('/processes/api/v1/processes');
        if (!response.data || !response.data.processes || !Array.isArray(response.data.processes)) {
            console.error('Ответ API не содержит массив процессов:', response.data);
            return [];
        }
        return response.data.processes;
    } catch (error) {
        console.error('Ошибка при получении процессов:', error);
        throw error;
    }
};

export const getProcessById = async (id: string): Promise<ProcessDetails> => {
    try {
        const response = await api.get<ProcessDetails>(`/processes/api/v1/tickets/${id}/tickets`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении процесса:', error);
        throw error;
    }
};

export const updateProcess = async (process: Process): Promise<Process> => {
    try {
        const response = await api.put<Process>(`/processes/api/v1/processes/${process.id}`, process);
        return response.data;
    } catch (error) {
        console.error('Ошибка при обновлении процесса:', error);
        throw error;
    }
};

export const createProcess = async (process: Omit<Process, 'id'>): Promise<Process> => {
    try {
        const response = await api.post<Process>('/processes/api/v1/processes', process);
        return response.data;
    } catch (error) {
        console.error('Ошибка при создании процесса:', error);
        throw error;
    }
};

export const moveTicket = async (ticketId: string, newStatusId: string): Promise<void> => {
    try {
        await api.post(`/processes/api/v1/tickets/${ticketId}/move/${newStatusId}`, {});
    } catch (error) {
        console.error('Ошибка при перемещении тикета:', error);
        throw error;
    }
};

export const postComment = async (ticketId: string, text: string): Promise<void> => {
    try {
        await api.post(`/processes/api/v1/tickets/${ticketId}/comments`, {
            text,
            mentionedUserIds: []
        });
    } catch (error) {
        console.error('Ошибка при отправке комментария:', error);
        throw error;
    }
};

export const getTicketById = async (ticketId: string): Promise<TicketDetails> => {
    try {
        const response = await api.get<TicketDetails>(`/processes/api/v1/tickets/${ticketId}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении тикета:', error);
        throw error;
    }
}; 