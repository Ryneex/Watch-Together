import { io } from "@/config/socket";
import { roomFormValidator } from "@/validations/roomForm.validator";
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { FormEvent, useState } from "react";

export default function NewRoomDialog() {
    const [error, setError] = useState<{ [key: string]: string[] } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    async function handleSubmit(e?: FormEvent<HTMLFormElement>) {
        e?.preventDefault();
        const targets = e?.target as unknown as HTMLInputElement[];
        const name = targets[0].value;
        const password = targets[1].value;
        const validate = roomFormValidator.safeParse({ name, password });
        if (validate.error) return setError(validate.error.formErrors.fieldErrors);
        io.emit("create", name, password);
        setIsModalOpen(false);
        setError(null);
    }
    return (
        <>
            <Button onClick={() => setIsModalOpen(true)} className="text-sm" size="sm" color="primary">
                New Room
            </Button>
            <Modal isOpen={isModalOpen} onOpenChange={(e) => (setIsModalOpen(e), setError(null))}>
                <ModalContent>
                    <ModalHeader>Create a new Room</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                            <div className="flex flex-col">
                                <Input size="sm" label="Room Name" />
                                {error?.name && <span className="text-sm text-red-500">{error?.name[0]}</span>}
                            </div>
                            <div className="flex flex-col">
                                <Input size="sm" label="Password" />
                                {error?.password && <span className="text-sm text-red-500">{error?.password[0]}</span>}
                            </div>
                            <Button className="my-2" type="submit" color="primary">
                                Save
                            </Button>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
