import { io } from "@/config/socket";
import { nameValidator } from "@/validations/name.validator";
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { FormEvent, useState } from "react";

export default function NewRoomDialog() {
    const [error, setError] = useState<string[] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    async function handleSubmit(e?: FormEvent<HTMLFormElement>) {
        e?.preventDefault();
        const targets = e?.target as unknown as HTMLInputElement[];
        const name = targets[0].value;
        const validate = nameValidator.safeParse(name);
        if (validate.error) return setError(validate.error.formErrors.formErrors);
        io.emit("create", name);
        setIsModalOpen(false);
        setError(null);
    }
    return (
        <>
            <Button onPress={() => setIsModalOpen(true)} className="text-sm" size="sm" color="primary">
                New Room
            </Button>
            <Modal isOpen={isModalOpen} onOpenChange={(e) => (setIsModalOpen(e), setError(null))}>
                <ModalContent>
                    <ModalHeader>Enter your room name</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="flex flex-col">
                                <Input size="sm" label="Room Name" />
                                {error && <span className="text-sm text-red-500">{error[0]}</span>}
                            </div>
                            <Button type="submit" color="primary">
                                Save
                            </Button>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
