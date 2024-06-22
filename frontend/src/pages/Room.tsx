import { Button } from "@nextui-org/react";
import { useEffect } from "react";
import YoutubePlayer from "youtube-player";

export default function Room() {
    useEffect(() => {
        YoutubePlayer("vidPlayer", {
            videoId: "H8wo3b7F1wE",
        });
    }, []);

    return (
        <div className="w-screen h-screen flex flex-col items-center gap-3 justify-center">
            <div className="aspect-video w-full max-w-[1000px]">
                <div id="vidPlayer" className="w-full h-full"></div>
            </div>
            <div className="max-w-[1000px]">
                <Button className="h-9">Sync With</Button>
            </div>
        </div>
    );
}
