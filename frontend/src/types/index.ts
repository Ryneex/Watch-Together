export interface PublicIRoom {
    id: string;
    name: string;
}

export interface IRoom {
    id: string;
    name: string;
    password: string;
    videoUrl?: string;
    users: {
        socket_id: string;
        name: string;
        timestamp: number;
    }[];
    lastActivity: number;
}
