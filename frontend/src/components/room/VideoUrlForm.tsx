import { io } from "@/config/socket";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";

export default function VideoUrlForm() {
    const [videoUrlInput, setVideoUrlInput] = useState("");
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                io.emit("setVideoUrl", videoUrlInput);
            }}
            className="flex w-full max-w-sm gap-3 mr-auto"
        >
            <Input classNames={{ inputWrapper: "bg-slate-200 w-full" }} value={videoUrlInput} onChange={(e) => setVideoUrlInput(e.target.value)} placeholder="Video Url" size="sm" />
            <Button type="submit" className="text-sm" color="primary" size="sm">
                Load
            </Button>
        </form>
    );
}
