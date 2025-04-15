export interface Process {
    id: string,
    name: string,
    description: string,
    graphId: string,
}

export const getProcesses = (): Promise<Process[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: '1',
                    name: 'Процесс реагирования на пожар',
                    description: 'Процесс обработки сигналов от датчиков пожара',
                    graphId: '1'
                },
                {
                    id: '2',
                    name: 'Процесс реагирования на потоп',
                    description: 'Процесс обработки сигналов от датчиков затопления',
                    graphId: '2'
                },
                {
                    id: '3',
                    name: 'Процесс реагирования на проникновение',
                    description: 'Процесс обработки сигналов от датчиков проникновения',
                    graphId: '3'
                }
            ]);
        }, 1000);
    });
};

export const getProcessById = (id: string): Promise<Process> => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            const list = await getProcesses();
            resolve(
                list.filter(x => x.id === id)[0]
            );
        }, 250);
    });
}

export const updateProcess = (process: Process): Promise<Process> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(process);
        }, 250);
    });
}

export const createProcess = (process: Omit<Process, 'id'>): Promise<Process> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                ...process,
                id: Math.random().toString(36).substr(2, 9)
            });
        }, 250);
    });
}; 