import { Socket } from "socket.io";
import { getRoomFromSocketID } from "./getRoomFromSocketID";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { io } from "../server";

export function removeUserFromRooms(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
    const { room, userIndex } = getRoomFromSocketID(socket.id);
    if (!room) return;
    room.users.splice(userIndex, 1);
    room.lastActivity = Date.now();
    socket.leave(room.id);
    io.to(room.id).emit("roomInfo", room);
}
