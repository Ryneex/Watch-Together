import { proxy } from "valtio";

export const appStore = proxy({
    name: localStorage.getItem("name") || "",
    rooms: [],
    setName(name: string) {
        this.name = name;
        localStorage.setItem("name", name);
    },
});
