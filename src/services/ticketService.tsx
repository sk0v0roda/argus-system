import { api } from './api';

export interface Ticket {
    id: string,
    name: string,
    description: string,
    priority: number,
    deadline: Date,
    createdAt: Date,
    updatedAt: Date,
    author: {
        id: number,
        name: string,
        avatar: string
    },
    executor: {
        id: number,
        name: string,
        avatar: string
    },
    status: {
        id: string,
        name: string,
        description: string,
        transitions: Transition[]
    },
    comments: Comment[]
}

export interface Comment {
    id: string,
    text: string,
    mentionedUsers: {
        id: number,
        name: string,
        avatar: string
    }[],
    author: {
        id: number,
        name: string,
        avatar: string
    },
    createdAt: Date
}

export interface Transition {
    toStatusId: string,
    name: string
}

export const getTickets = async (): Promise<Ticket[]> => {
    try {
        const response = await api.get<Ticket[]>('/processes/api/v1/tickets');
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении тикетов:', error);
        throw error;
    }
};

export const getTicketById = async (id: string): Promise<Ticket> => {
    try {
        const response = await api.get<Ticket>(`/processes/api/v1/tickets/${id}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении тикета:', error);
        throw error;
    }
};

export const updateTicket = async (ticket: Ticket): Promise<Ticket> => {
    try {
        const response = await api.put<Ticket>(`/processes/api/v1/tickets/${ticket.id}`, ticket);
        return response.data;
    } catch (error) {
        console.error('Ошибка при обновлении тикета:', error);
        throw error;
    }
};

export const createTicket = async (ticket: Omit<Ticket, 'id'>): Promise<Ticket> => {
    try {
        const response = await api.post<Ticket>('/processes/api/v1/tickets', ticket);
        return response.data;
    } catch (error) {
        console.error('Ошибка при создании тикета:', error);
        throw error;
    }
};

export const postComment = async (ticketId: string, commentText: string): Promise<Comment> => {
    try {
        const response = await api.post<Comment>(`/processes/api/v1/tickets/${ticketId}/comments`, {
                text: commentText,
            mentionedUserIds: []
        });
        return response.data;
    } catch (error) {
        console.error('Ошибка при отправке комментария:', error);
        throw error;
    }
}; 