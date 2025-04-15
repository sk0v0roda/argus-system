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

export const getTickets = (): Promise<Ticket[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    id: '1',
                    name: 'Пожар в помещении А1',
                    description: 'Сработал датчик дыма в помещении А1',
                    priority: 1,
                    deadline: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    author: {
                        id: 1,
                        name: 'Иван Иванов',
                        avatar: ''
                    },
                    executor: {
                        id: 2,
                        name: 'Петр Петров',
                        avatar: ''
                    },
                    status: {
                        id: '1',
                        name: 'Критический',
                        description: 'Требует немедленного реагирования',
                        transitions: [
                            {
                                toStatusId: '2',
                                name: 'Перевести в высокий'
                            }
                        ]
                    },
                    comments: []
                }
            ]);
        }, 1000);
    });
};

export const getTicketById = (id: string): Promise<Ticket> => {
    return new Promise((resolve) => {
        setTimeout(async () => {
            const list = await getTickets();
            resolve(
                list.filter(x => x.id === id)[0]
            );
        }, 250);
    });
}

export const updateTicket = (ticket: Ticket): Promise<Ticket> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(ticket);
        }, 250);
    });
}

export const createTicket = (ticket: Omit<Ticket, 'id'>): Promise<Ticket> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                ...ticket,
                id: Math.random().toString(36).substr(2, 9)
            });
        }, 250);
    });
};

export const postComment = (ticketId: string, commentText: string): Promise<Comment> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: Math.random().toString(36).substr(2, 9),
                text: commentText,
                mentionedUsers: [],
                author: {
                    id: 1,
                    name: 'Иван Иванов',
                    avatar: ''
                },
                createdAt: new Date()
            });
        }, 250);
    });
}; 