import { rooms } from "../rooms";
import { io } from "../server";

export function removeRoomIfNoActivity(id: string, interval: NodeJS.Timeout) {
    const roomIndex = rooms.findIndex((e) => e.id === id);
    const room = rooms[roomIndex];
    if (!room.users.length && room.lastActivity < Date.now() - 30000) {
        clearInterval(interval);
        rooms.splice(roomIndex, 1);
        io.emit("rooms", rooms);
    }
}
