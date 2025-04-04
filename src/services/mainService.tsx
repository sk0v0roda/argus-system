import {Node, Edge} from "@xyflow/react";

export interface StatusGraph {
    id: string;
    name: string;
    nodes: Node[];
    edges: Edge[];
}

export interface Sensor {
    "id": string | undefined,
    "ticketTitle": string,
    "ticketDescription": string,
    "ticketPriority": string,
    "ticketDeadline": Date,
    "businessProcessId": string
  }

export interface Status {
    "id": string | undefined
    "name": string,
    "description": string,
    "escalationSLA": number,
    "notification": {
        "deliveryType": string,
        "pingInterval": number
    },
    "comment": {
        "text": string,
        "userIds": number[]
    },
    "dutyId": number,
}

export interface Duty {
    "id": number | undefined,
    "start_time": Date,
    "interval": {
      "seconds": number,
      "zero": boolean,
      "nano": number,
      "negative": boolean,
      "positive": boolean,
      "units": [
        {
          "durationEstimated": boolean,
          "timeBased": boolean,
          "dateBased": boolean
        }
      ]
    },
    "ids": number[]
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
                { 
                    id: '1', 
                    ticketTitle: 'Датчик дыма первый этаж, комната А1',
                    ticketDescription: 'Датчик для обнаружения дыма в помещении А1',
                    ticketPriority: 'Высокий',
                    ticketDeadline: new Date(),
                    businessProcessId: 'BP001'
                },
                { 
                    id: '2', 
                    ticketTitle: 'Датчик дыма первый этаж, комната Б3',
                    ticketDescription: 'Датчик для обнаружения дыма в помещении Б3',
                    ticketPriority: 'Высокий',
                    ticketDeadline: new Date(),
                    businessProcessId: 'BP001'
                },
                { 
                    id: '3', 
                    ticketTitle: 'Датчик дыма второй этаж, комната Х1',
                    ticketDescription: 'Датчик для обнаружения дыма в помещении Х1',
                    ticketPriority: 'Высокий',
                    ticketDeadline: new Date(),
                    businessProcessId: 'BP001'
                },
                { 
                    id: '4', 
                    ticketTitle: 'Датчик затопления подвал',
                    ticketDescription: 'Датчик для обнаружения затопления в подвале',
                    ticketPriority: 'Средний',
                    ticketDeadline: new Date(),
                    businessProcessId: 'BP002'
                },
                { 
                    id: '5', 
                    ticketTitle: 'Датчик проникновения',
                    ticketDescription: 'Датчик для обнаружения несанкционированного проникновения',
                    ticketPriority: 'Высокий',
                    ticketDeadline: new Date(),
                    businessProcessId: 'BP003'
                },
            ]);
        }, 1000);
    });
};

export const getSensorById = (id: string): Promise<Sensor> => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            const list = await getSensors();
            resolve(
                list.filter(x => x.id === id)[0]
            );
        }, 250);
    });
}

export const updateSensor = (sensor: Sensor): Promise<Sensor> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(sensor);
        }, 250);
    });
}

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

export const getDuties = (): Promise<Duty[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: 1,
                    start_time: new Date(),
                    interval: {
                        seconds: 28800, // 8 часов
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
                    },
                    ids: [1, 2, 3]
                },
                {
                    id: 2,
                    start_time: new Date(),
                    interval: {
                        seconds: 43200, // 12 часов
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
                    },
                    ids: [4, 5]
                }
            ]);
        }, 1000);
    });
};

export const getDutyById = (id: number): Promise<Duty> => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            const list = await getDuties();
            resolve(
                list.filter(x => x.id === id)[0]
            );
        }, 250);
    });
}

export const updateDuty = (duty: Duty): Promise<Duty> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(duty);
        }, 250);
    });
}

export const getStatuses = (): Promise<Status[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: '1',
                    name: 'Критический',
                    description: 'Требует немедленного реагирования',
                    escalationSLA: 15,
                    notification: {
                        deliveryType: 'SMS',
                        pingInterval: 5
                    },
                    comment: {
                        text: 'Оповестить руководство',
                        userIds: [1, 2]
                    },
                    dutyId: 1
                },
                {
                    id: '2',
                    name: 'Высокий',
                    description: 'Требует реагирования в течение часа',
                    escalationSLA: 60,
                    notification: {
                        deliveryType: 'Email',
                        pingInterval: 15
                    },
                    comment: {
                        text: 'Оповестить дежурную смену',
                        userIds: [3, 4]
                    },
                    dutyId: 2
                },
                {
                    id: '3',
                    name: 'Средний',
                    description: 'Требует реагирования в течение дня',
                    escalationSLA: 480,
                    notification: {
                        deliveryType: 'Email',
                        pingInterval: 60
                    },
                    comment: {
                        text: 'Зафиксировать в системе',
                        userIds: [5]
                    },
                    dutyId: 1
                }
            ]);
        }, 1000);
    });
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

export const updateStatus = (status: Status): Promise<Status> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(status);
        }, 250);
    });
}