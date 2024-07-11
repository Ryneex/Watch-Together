import NameDialog from "@/components/NameDialog";
import NewRoomDialog from "@/components/NewRoomDialog";
import RoomCards from "@/components/RoomCards";
import { appStore } from "@/store/appStore";
import { Button } from "@nextui-org/react";
import { useRef } from "react";
import { useSnapshot } from "valtio";

export default function Home() {
    const { rooms } = useSnapshot(appStore);
    const setModal = useRef<React.Dispatch<React.SetStateAction<boolean>>>(null);

    return (
        <div className="h-full w-full bg-slate-100">
            <div className="fixed top-2 right-2 flex gap-3 items-center">
                <NewRoomDialog setModal={setModal} />
                <NameDialog />
            </div>
            {!rooms.length ? (
                <div className="w-full h-full flex flex-col gap-3 items-center justify-center text-black/50 font-medium">
                    <div>No Rooms</div>
                    <Button onClick={() => setModal.current && setModal.current(true)} className="h-8 px-3 rounded-lg" color="primary">
                        Create New
                    </Button>
                </div>
            ) : (
                <RoomCards rooms={rooms} />
            )}
        </div>
    );
}
