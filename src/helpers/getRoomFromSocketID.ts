import { rooms } from "../rooms";

export function getRoomFromSocketID(socketId: string) {
    for (let i = 0; i < rooms.length; i++) {
        const room = rooms[i];
        const userIndex = room.users.findIndex((e) => e.socket_id === socketId);
        if (userIndex !== -1) {
            return { roomIndex: i, userIndex, room };
        }
    }
    return { roomIndex: null, userIndex: null, room: null };
}
