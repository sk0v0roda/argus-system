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

export const getStatusGraphs = async (): Promise<StatusGraph[]> => {
    try {
        const response = await api.get<{ graphs: StatusGraphResponse[] }>('/statuses/api/v1/graphs');
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
        const graphs = await getStatusGraphs();
        const graph = graphs.find(g => g.id === id);
        
        if (!graph) {
            throw new Error('Граф не найден');
        }
        
        return graph;
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
    const VERTICAL_SPACING = 150; // Расстояние между уровнями
    const HORIZONTAL_SPACING = 400; // Увеличили расстояние между узлами на одном уровне с 250 до 400
    
    // Находим корневые узлы (те, в которые нет входящих рёбер)
    const incomingEdges = new Set(
        graph.statuses.flatMap(status => 
            status.transitions.map(t => t.statusId)
        )
    );
    
    const rootNodes = graph.statuses.filter(status => !incomingEdges.has(status.id));

    // Строим карту переходов для быстрого доступа
    const transitionsMap = new Map(
        graph.statuses.map(status => [
            status.id,
            status.transitions.map(t => t.statusId)
        ])
    );

    // Вычисляем уровень для каждого узла
    const levels = new Map<string, number>();
    const processLevel = (statusId: string, level: number) => {
        if (levels.has(statusId)) {
            return;
        }
        levels.set(statusId, level);
        const transitions = transitionsMap.get(statusId) || [];
        transitions.forEach(targetId => {
            processLevel(targetId, level + 1);
        });
    };

    // Начинаем с корневых узлов
    rootNodes.forEach(node => processLevel(node.id, 0));

    // Группируем узлы по уровням
    const nodesAtLevel = new Map<number, string[]>();
    levels.forEach((level, statusId) => {
        if (!nodesAtLevel.has(level)) {
            nodesAtLevel.set(level, []);
        }
        nodesAtLevel.get(level)?.push(statusId);
    });

    // Создаем узлы с вычисленными позициями
    const nodes: Node[] = graph.statuses.map(status => {
        const level = levels.get(status.id) || 0;
        const nodesInLevel = nodesAtLevel.get(level) || [];
        const indexInLevel = nodesInLevel.indexOf(status.id);
        const totalInLevel = nodesInLevel.length;
        
        // Вычисляем x-координату, чтобы узлы на одном уровне были по центру
        const x = (indexInLevel - (totalInLevel - 1) / 2) * HORIZONTAL_SPACING;
        
        return {
        id: status.id,
        type: 'default',
            position: { 
                x: x,
                y: level * VERTICAL_SPACING
            },
        data: { 
            label: status.name,
            description: status.description,
            escalationSLA: status.escalationSLA,
            notification: status.notification,
            comment: status.comment,
            dutyId: status.dutyId
            },
            style: {
                width: 200,
                padding: 10,
                borderRadius: 8,
                border: '1px solid #ccc',
                backgroundColor: '#fff'
        }
        };
    });

    const edges: Edge[] = graph.statuses.flatMap(status => 
        status.transitions.map(transition => ({
            id: `e${status.id}-${transition.statusId}`,
            source: status.id,
            target: transition.statusId,
            label: transition.name,
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#666' },
            labelStyle: { fill: '#666', fontSize: 12 }
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