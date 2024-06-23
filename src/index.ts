import { getRoomFromSocketID } from "./helpers/getRoomFromSocketID";
import { getRoomsWithoutPrivateInfo } from "./helpers/getRoomsWithoutPrivateInfo";
import { removeRoomIfNoActivity } from "./helpers/removeRoomIfNoActivity";
import { removeUserFromRooms } from "./helpers/removeUserFromRooms";
import { rooms } from "./rooms";
import { io, server } from "./server";
import { nameValidator } from "./validations/name.validator";
import { v4 } from "uuid";

io.use((socket, next) => {
    const validate = nameValidator.safeParse(socket.handshake.auth.name);
    if (validate.data) socket.name = validate.data;
    next();
});

io.on("connection", (socket) => {
    socket.emit("rooms", getRoomsWithoutPrivateInfo());

    socket.on("create", (name: string) => {
        if (nameValidator.safeParse(name).error || !socket.name) return;
        const id = v4();
        rooms.push({
            id,
            name: name,
            lastActivity: Date.now(),
            users: [],
        });
        const interval: NodeJS.Timeout = setInterval(() => removeRoomIfNoActivity(id, interval), 30000);
        io.emit("rooms", getRoomsWithoutPrivateInfo());
    });

    socket.on("joinRoom", async (id: string) => {
        const room = rooms.find((e) => e.id === id);
        if (!room || !socket.name) return socket.emit("redirectToHome");
        removeUserFromRooms(socket);
        room.lastActivity = Date.now();
        await socket.join(id);
        room.lastActivity = Date.now();
        room.users.push({
            socket_id: socket.id,
            name: socket.handshake.auth.name,
            timestamp: 0,
        });
        io.to(id).emit("roomInfo", room);
    });

    socket.on("updateTimestamp", (time: number) => {
        const { room, userIndex } = getRoomFromSocketID(socket.id);
        if (!room) return;
        const user = room.users[userIndex];
        user.timestamp = time;
        socket.emit("roomInfo", room);
    });

    socket.on("setVideoUrl", (e: string) => {
        const { room } = getRoomFromSocketID(socket.id);
        if (!room) return;
        room.videoUrl = e;
        io.to(room.id).emit("roomInfo", room);
    });

    socket.on("syncEveryone", (time: number) => {
        const { room } = getRoomFromSocketID(socket.id);
        if (!room) return;
        socket.to(room.id).emit("syncEveryone", time);
    });

    socket.on("leave", () => {
        removeUserFromRooms(socket);
    });

    socket.on("disconnect", () => {
        removeUserFromRooms(socket);
    });
});

server.listen(process.env.PORT || 3000, () => console.log("Server is running on http://localhost:3000"));
