import NameDialog from "@/components/NameDialog";
import NewRoomDialog from "@/components/NewRoomDialog";

export default function Home() {
    return (
        <div className="fixed top-2 right-2 flex gap-3 items-center">
            <NewRoomDialog />
            <NameDialog />
        </div>
    );
}
