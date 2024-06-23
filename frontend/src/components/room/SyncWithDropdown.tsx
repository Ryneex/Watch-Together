import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { Duration } from "luxon";
import { IRoom } from "@/types";
import { appStore } from "@/store/appStore";

export default function SyncWithDropdown({ room }: { room: IRoom | null }) {
    return room ? (
        <Dropdown placement="bottom-end">
            <DropdownTrigger>
                <Button className="text-sm" color="primary" size="sm">
                    Sync With
                </Button>
            </DropdownTrigger>
            <DropdownMenu>
                {room.users.map((e, i) => (
                    <DropdownItem onClick={() => appStore.player?.seekTo(e.timestamp, true)} shortcut={Duration.fromMillis(e.timestamp * 1000).toFormat("hh:mm:ss")} key={i}>
                        {e.name}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    ) : (
        <Button className="text-sm" color="primary" size="sm">
            Sync With
        </Button>
    );
}
