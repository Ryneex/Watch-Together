import NameDialog from "@/components/NameDialog";
import NewRoomDialog from "@/components/NewRoomDialog";
import RoomCards from "@/components/RoomCards";
import { appStore } from "@/store/appStore";
import { useSnapshot } from "valtio";

export default function Home() {
    const { rooms } = useSnapshot(appStore);
    return (
        <div className="h-full w-full bg-slate-100">
            <div className="fixed top-2 right-2 flex gap-3 items-center">
                <NewRoomDialog />
                <NameDialog />
            </div>
            {!rooms.length ? <div className="w-full h-full flex items-center justify-center text-black/50 font-medium">No Rooms</div> : <RoomCards rooms={rooms} />}
        </div>
    );
}
