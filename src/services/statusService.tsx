import {Node, Edge} from "@xyflow/react";
import { api, getApiUrl } from './api';

export interface StatusGraph {
    id: string;
    name: string;
    description: string;
    nodes: Node[];
    edges: Edge[];
}

export interface StatusGraphDTO {
    name: string;
    description: string;
    vertexes: string[];
    edges: {
        from: string;
        to: string;
    }[];
}

export enum NotificationType {
    SMS = 0,
    EMAIL = 1
}

export interface Status {
    id: string | undefined,
    name: string,
    description: string,
    escalationSLA: number,
    notification: {
        deliveryType: NotificationType,
        pingInterval: number
    },
    comment: {
        text: string,
        userIds: number[]
    },
    dutyId: number,
}

export interface StatusTransition {
    statusId: string;
    name: string;
}

export interface UserInfo {
    id: number;
    userName: string;
    avatar: string;
}

export interface StatusComment {
    text: string;
    usersInfo: UserInfo[];
}

export interface GraphStatus {
    id: string;
    name: string;
    description: string;
    escalationSLA: number;
    notification: {
        deliveryType: NotificationType;
        pingInterval: number;
    };
    comment: StatusComment;
    orderNum: number;
    transitions: StatusTransition[];
    dutyId: number;
}

export interface StatusGraphResponse {
    id: string;
    name: string;
    description: string;
    statuses: GraphStatus[];
}

export const getStatusGraphs = async (graphIds?: string[]): Promise<StatusGraph[]> => {
    try {
        let url = '/statuses/api/v1/graphs';
        if (graphIds && graphIds.length > 0) {
            url += `?graphIds=${graphIds[0]}`;
        }
        
        console.log('Request URL:', url);
        const response = await api.get<{ graphs: StatusGraphResponse[] }>(url);
        
        console.log('Response data:', response.data);
        if (!response.data.graphs || !Array.isArray(response.data.graphs)) {
            console.error('Ответ API не содержит массив графов:', response.data);
            return [];
        }
        return response.data.graphs.map(graph => convertToReactFlowFormat(graph));
    } catch (error) {
        console.error('Ошибка при получении графов статусов:', error);
        throw error;
    }
};

export const getStatusGraphById = async (id: string): Promise<StatusGraph> => {
    try {
        console.log('Getting graph by ID:', id);
        const url = `/statuses/api/v1/graphs?graphIds=${id}`;
        console.log('Request URL:', url);
        
        const response = await api.get<{ graphs: StatusGraphResponse[] }>(url);
        console.log('Response data:', response.data);
        
        if (!response.data.graphs || response.data.graphs.length === 0) {
            throw new Error('Граф не найден');
        }
        return convertToReactFlowFormat(response.data.graphs[0]);
    } catch (error) {
        console.error('Ошибка при получении графа:', error);
        throw error;
    }
};

export const updateStatusGraph = async (graph: StatusGraph): Promise<StatusGraph> => {
    try {
        const graphDTO: StatusGraphDTO = {
            name: graph.name,
            description: graph.description,
            vertexes: graph.nodes.map(node => node.id),
            edges: graph.edges.map(edge => ({
                from: edge.source,
                to: edge.target
            }))
        };

        const response = await api.put<StatusGraphResponse>(`/statuses/api/v1/graphs/${graph.id}`, graphDTO);
        return convertToReactFlowFormat(response.data);
    } catch (error) {
        console.error('Ошибка при обновлении графа:', error);
        throw error;
    }
};

export const createStatusGraph = async (graph: StatusGraphDTO): Promise<StatusGraph> => {
    try {
        const response = await api.post<StatusGraphResponse>('/statuses/api/v1/graphs', graph);
        return convertToReactFlowFormat(response.data);
    } catch (error) {
        console.error('Ошибка при создании графа статусов:', error);
        throw error;
    }
};

export const getStatuses = async (): Promise<Status[]> => {
    try {
        const response = await api.get<{ statuses: Status[] }>('/statuses/api/v1/statuses');
        if (!response.data.statuses || !Array.isArray(response.data.statuses)) {
            console.error('Ответ API не содержит массив статусов:', response.data);
            return [];
        }
        return response.data.statuses;
    } catch (error) {
        console.error('Ошибка при получении статусов:', error);
        throw error;
    }
};

export const getStatusById = (id: string): Promise<Status> => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            const list = await getStatuses();
            resolve(
                list.filter(x => x.id === id)[0]
            );
        }, 250);
    });
}

export const updateStatus = async (status: Status): Promise<Status> => {
    try {
        const response = await api.put<Status>(`/statuses/api/v1/statuses`, {
            statusId: status.id,
            name: status.name,
            description: status.description,
            escalationSLA: status.escalationSLA,
            notification: {
                deliveryType: status.notification.deliveryType,
                pingInterval: status.notification.pingInterval
            },
            comment: {
                text: status.comment.text,
                userIds: status.comment.userIds
            },
            dutyId: status.dutyId
        });
        return response.data;
    } catch (error) {
        console.error('Ошибка при обновлении статуса:', error);
        throw error;
    }
};

export const createStatus = async (status: Omit<Status, 'id'>): Promise<Status> => {
    try {
        const response = await api.post<Status>('/statuses/api/v1/statuses', {
            name: status.name,
            description: status.description,
            escalationSLA: status.escalationSLA,
            notification: {
                deliveryType: status.notification.deliveryType,
                pingInterval: status.notification.pingInterval
            },
            comment: {
                text: status.comment.text,
                userIds: status.comment.userIds
            },
            dutyId: status.dutyId
        });
        return response.data;
    } catch (error) {
        console.error('Ошибка при создании статуса:', error);
        throw error;
    }
};

export const convertToReactFlowFormat = (graph: StatusGraphResponse): StatusGraph => {
    const nodes: Node[] = graph.statuses.map(status => ({
        id: status.id,
        type: 'default',
        position: { x: status.orderNum * 200, y: 0 }, // Пока просто располагаем по горизонтали
        data: { 
            label: status.name,
            description: status.description,
            escalationSLA: status.escalationSLA,
            notification: status.notification,
            comment: status.comment,
            dutyId: status.dutyId
        }
    }));

    const edges: Edge[] = graph.statuses.flatMap(status => 
        status.transitions.map(transition => ({
            id: `e${status.id}-${transition.statusId}`,
            source: status.id,
            target: transition.statusId,
            label: transition.name
        }))
    );

    return {
        id: graph.id,
        name: graph.name,
        description: graph.description,
        nodes,
        edges
    };
}; 