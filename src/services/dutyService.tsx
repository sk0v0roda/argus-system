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

export const createDuty = (duty: Omit<Duty, 'id'>): Promise<Duty> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                ...duty,
                id: Math.floor(Math.random() * 1000)
            });
        }, 250);
    });
}; 