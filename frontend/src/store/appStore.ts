import { PublicIRoom } from "@/types";
import { proxy } from "valtio";
import { YouTubePlayer } from "youtube-player/dist/types";

export const appStore = proxy({
    name: localStorage.getItem("name") || "",
    rooms: [] as PublicIRoom[],
    player: null as YouTubePlayer | null,
    showTimestampsInfo: true,
});
