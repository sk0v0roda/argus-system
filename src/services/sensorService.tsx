export interface Sensor {
    "id": string | undefined,
    "ticketTitle": string,
    "ticketDescription": string,
    "ticketPriority": string,
    "ticketDeadline": Date,
    "businessProcessId": string
}

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

export const createSensor = (sensor: Omit<Sensor, 'id'>): Promise<Sensor> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                ...sensor,
                id: Math.random().toString(36).substr(2, 9)
            });
        }, 250);
    });
}; 