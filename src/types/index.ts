export interface IRoom {
    id: string;
    name: string;
    videoUrl?: string;
    users: {
        socket_id: string;
        name: string;
        timestamp: number;
    }[];
    lastActivity: number;
}

declare module "socket.io" {
    interface Socket {
        name: string;
    }
}
