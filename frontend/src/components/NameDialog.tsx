import { io } from "@/config/socket";
import { appStore } from "@/store/appStore";
import { nameValidator } from "@/validations/name.validator";
import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { useSnapshot } from "valtio";

export default function NameDialog() {
    const { name } = useSnapshot(appStore);
    const [isModalOpen, setIsModalOpen] = useState(Number(name.length) < 5);
    const [error, setError] = useState<string[] | null>(null);
    async function handleSubmit(e?: FormEvent<HTMLFormElement>) {
        e?.preventDefault();
        const targets = e?.target as unknown as HTMLInputElement[];
        const name = targets[0].value;
        const validate = nameValidator.safeParse(name);
        if (validate.error) return setError(validate.error.formErrors.formErrors);
        setError(null);
        appStore.setName(name);
        io.disconnect().connect();
        setIsModalOpen(false);
    }

    return (
        <>
            <Button onPress={() => setIsModalOpen(true)} className="rounded-full aspect-square min-w-0 h-9" color="primary">
                {name.split("")[0]}
            </Button>
            <Modal isOpen={isModalOpen} onOpenChange={(e) => (e ? setIsModalOpen(true) : !nameValidator.safeParse(name).error && (setIsModalOpen(false), setError(null)))}>
                <ModalContent>
                    <ModalHeader>Enter your name</ModalHeader>
                    <ModalBody>
                        <span className="text-sm text-black/80">Your name will be shown to others</span>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="flex flex-col">
                                <Input size="sm" defaultValue={name} label="Name" />
                                {error && <span className="text-sm text-red-500">{error[0]}</span>}
                            </div>
                            <Button color="primary" type="submit">
                                Save
                            </Button>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
