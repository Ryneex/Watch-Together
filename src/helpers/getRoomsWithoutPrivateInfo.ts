import { rooms } from "../rooms";

export function getRoomsWithoutPrivateInfo() {
    return rooms.map((e) => ({ id: e.id, name: e.name }));
}
