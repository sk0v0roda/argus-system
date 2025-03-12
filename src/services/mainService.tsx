import {Node, Edge} from "@xyflow/react";

export interface StatusGraph {
    id: string;
    name: string;
    nodes: Node[];
    edges: Edge[];
}

export interface Sensor {
    id: number;
    name: string;
}
const fireResponseProcess = {
    nodes: [
        {
            id: '1',
            type: 'input', // Тип узла (input — начальный узел)
            data: { label: 'Обнаружение пожара' },
            position: { x: 250, y: 0 },
        },
        {
            id: '2',
            data: { label: 'Оповещение сотрудников' },
            position: { x: 250, y: 100 },
        },
        {
            id: '3',
            data: { label: 'Эвакуация людей' },
            position: { x: 250, y: 200 },
        },
        {
            id: '4',
            data: { label: 'Вызов пожарной службы' },
            position: { x: 0, y: 200 },
        },
        {
            id: '5',
            data: { label: 'Тушение пожара (если возможно)' },
            position: { x: 500, y: 200 },
        },
        {
            id: '6',
            type: 'output', // Тип узла (output — конечный узел)
            data: { label: 'Завершение процесса' },
            position: { x: 250, y: 300 },
        },
    ],
    edges: [
        {
            id: 'e1-2',
            source: '1',
            target: '2',
        },
        {
            id: 'e2-3',
            source: '2',
            target: '3',
        },
        {
            id: 'e2-4',
            source: '2',
            target: '4',
        },
        {
            id: 'e2-5',
            source: '2',
            target: '5',
        },
        {
            id: 'e3-6',
            source: '3',
            target: '6',
        },
        {
            id: 'e4-6',
            source: '4',
            target: '6',
        },
        {
            id: 'e5-6',
            source: '5',
            target: '6',
        },
    ],
};
export const getStatusGraphs = (): Promise<StatusGraph[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: '1', name: 'Реагирование на пожар', nodes: fireResponseProcess.nodes, edges: fireResponseProcess.edges },
                { id: '2', name: 'Устранение последствий потопа', nodes: [], edges: [] },
                { id: '3', name: 'Несанкционированное проникновение', nodes: [], edges: []  },
            ]);
        }, 1000);
    });
};

export const getSensors = (): Promise<Sensor[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, name: 'Датчик дыма первый этаж, комната А1' },
                { id: 2, name: 'Датчик дыма первый этаж, комната Б3' },
                { id: 3, name: 'Датчик дыма второй этаж, комната Х1' },
                { id: 4, name: 'Датчик затопления подвал' },
                { id: 5, name: 'Датчик проникновения' },
            ]);
        }, 1000);
    });
};


export const getStatusGraphById = (id: string): Promise<StatusGraph> => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            const list = await getStatusGraphs();
            resolve(
                list.filter(x => x.id === id)[0]
            );
        }, 250);
    });
}