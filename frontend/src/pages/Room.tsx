import SyncWithDropdown from "@/components/room/SyncWithDropdown";
import TimestampsInfo from "@/components/room/TimestampsInfo";
import VideoUrlForm from "@/components/room/VideoUrlForm";
import { io } from "@/config/socket";
import { getIdFromVideoUrl } from "@/helpers/getIdFromVideoUrl";
import { appStore } from "@/store/appStore";
import { IRoom } from "@/types";
import { Button } from "@nextui-org/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSnapshot } from "valtio";
import YoutubePlayer from "youtube-player";
import { z } from "zod";

export default function Room() {
    const params = useParams();
    const [roomInfo, setRoomInfo] = useState<IRoom | null>(null);
    const isYTVideo = useMemo(() => !z.string().url().startsWith("https://www.youtube.com/watch?v=").safeParse(roomInfo?.videoUrl).error, [roomInfo]);
    const videoId = useRef("");
    const normalVidPlayer = useRef<HTMLVideoElement>(null!);
    const videoContainer = useRef<HTMLDivElement>(null!);
    const { showTimestampsInfo } = useSnapshot(appStore);

    // loads youtube player when YT url is given
    useEffect(() => {
        if (!isYTVideo) return;
        const player = YoutubePlayer("vidPlayer");
        appStore.player = player;

        const interval = setInterval(async () => {
            io.emit("updateTimestamp", await player.getCurrentTime());
        }, 1000);
        return () => {
            player.destroy();
            videoId.current = "";
            clearInterval(interval);
            appStore.player = null;
        };
    }, [isYTVideo]);

    // loads normal player
    useEffect(() => {
        if (isYTVideo) return;
        const seekTo = (seconds: number) => (normalVidPlayer.current.currentTime = seconds);
        const loadVideoById = (url: string) => (normalVidPlayer.current.src = url);
        const getCurrentTime = () => normalVidPlayer.current.currentTime;

        const interval = setInterval(async () => {
            io.emit("updateTimestamp", normalVidPlayer.current?.currentTime);
        }, 1000);

        appStore.player = { seekTo, loadVideoById, getCurrentTime } as any;
        return () => {
            normalVidPlayer.current && (normalVidPlayer.current.src = "");
            clearInterval(interval);
        };
    }, [isYTVideo]);

    // loads new video when url is given by server
    useEffect(() => {
        if (!roomInfo?.videoUrl) return;
        if (videoId.current === roomInfo.videoUrl) return;
        videoId.current = roomInfo.videoUrl;
        const url = isYTVideo ? getIdFromVideoUrl(roomInfo.videoUrl) : roomInfo.videoUrl;
        if (!url) return;
        appStore.player?.loadVideoById(url);
    }, [roomInfo]);

    useEffect(() => {
        const seek = (e: number) => appStore.player?.seekTo(e, true);
        io.emit("joinRoom", params.id, params.password);
        io.on("roomInfo", setRoomInfo);
        io.on("syncEveryone", seek);

        return () => {
            io.off("roomInfo", setRoomInfo);
            io.emit("leave");
            io.on("syncEveryone", seek);
        };
    }, []);

    if (!roomInfo) return;
    return (
        <div className="h-full bg-white flex flex-col items-center gap-3 justify-center p-5">
            <div className="max-w-[1000px] w-full flex gap-3 flex-wrap sm:flex-nowrap">
                <VideoUrlForm />
                <Button onClick={() => videoContainer.current.requestFullscreen()} className="text-sm" size="sm">
                    Go Fullscreen
                </Button>
                <Button color={showTimestampsInfo ? "primary" : "default"} className="text-sm" size="sm" onClick={() => (appStore.showTimestampsInfo = !appStore.showTimestampsInfo)}>
                    Show Timestamps
                </Button>
                <Button onClick={async () => io.emit("syncEveryone", await appStore.player?.getCurrentTime())} className="text-sm" color="primary" size="sm">
                    Sync All
                </Button>
                <SyncWithDropdown room={roomInfo} />
            </div>
            <div ref={videoContainer} className="aspect-video w-full max-w-[1000px] relative">
                {!roomInfo?.videoUrl && <div className="absolute w-full h-full flex z-10 items-center justify-center bg-slate-800 text-white">Video Url isn't provided</div>}
                <TimestampsInfo roomInfo={roomInfo} />
                <div className={`w-full h-full ${!isYTVideo && "hidden"}`}>
                    <div id="vidPlayer" className="w-full h-full"></div>
                </div>
                <video ref={normalVidPlayer} className={`w-full h-full ${isYTVideo && "hidden"}`} src="" controls></video>
            </div>
        </div>
    );
}
