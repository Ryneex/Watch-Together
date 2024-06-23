import { appStore } from "@/store/appStore";
import { IRoom } from "@/types";
import { Duration } from "luxon";
import { useSnapshot } from "valtio";

export default function TimestampsInfo({ roomInfo }: { roomInfo: IRoom | null }) {
    const { showTimestampsInfo } = useSnapshot(appStore);
    if (showTimestampsInfo)
        return (
            <div className="absolute flex flex-col p-1 text-white bg-black/30 rounded-sm text-xs z-10">
                {roomInfo?.users.map((e, i) => (
                    <div key={i} className="flex items-center">
                        <span className="w-14 truncate inline-block">{e.name}</span> {Duration.fromMillis(e.timestamp * 1000).toFormat("hh:mm:ss")}
                    </div>
                ))}
            </div>
        );
}
