import { io } from "@/config/socket";
import { PublicIRoom } from "@/types";
import { nameValidator } from "@/validations/name.validator";
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function RoomCards({ rooms }: { rooms: Readonly<PublicIRoom[]> }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [roomId, setRoomId] = useState<string>(null!);

    async function handleSubmit(e?: React.FormEvent<HTMLFormElement>) {
        e?.preventDefault();
        const targets = e?.target as unknown as HTMLInputElement[];
        const password = targets[0].value;
        const validate = nameValidator.safeParse(password);
        if (validate.error) return setError(validate.error.formErrors.formErrors[0]);
        setError(null);
        io.emit("checkRoomPassword", roomId, password);
    }

    useEffect(() => {
        io.on("passwordError", setError);

        return () => {
            io.off("passwordError", setError);
        };
    }, []);

    return (
        <div className="w-full h-full p-5 flex flex-wrap content-start gap-5">
            <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
                <ModalContent>
                    <ModalHeader>Enter room password</ModalHeader>
                    <ModalBody>
                        <span className="text-sm text-black/80">Your name will be shown to others</span>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="flex flex-col">
                                <Input size="sm" label="Room Password" />
                                {error && <span className="text-sm text-red-500">{error}</span>}
                            </div>
                            <Button color="primary" type="submit">
                                Save
                            </Button>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
            {rooms.map((e, i) => (
                <div
                    key={i}
                    onClick={() => {
                        setRoomId(e.id);
                        setError(null)
                        setIsModalOpen(true);
                    }}
                    className="size-32 sm:size-40 cursor-pointer p-2 rounded-md border flex justify-center items-center text-center bg-white shadow-sm"
                >
                    <h2 className="font-semibold line-clamp-4 text-ellipsis">{e.name}</h2>
                </div>
            ))}
        </div>
    );
}
