'use client'
import { db } from "@/app/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Task } from "@/types/types";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    idTask: string | null;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function DeleteModal({ isOpen, onClose, idTask, setTasks }: Props) {

    const handleDeleteFromState = (id: string | null) => {
        if (!id) return;
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    }

    const handleDelete = async () => {
        if (!idTask) {
            console.log("No task id");
            return;
        };

        const ref = doc(db, "tasks", (idTask as string));
        deleteDoc(ref)
            .then(() => {
                onClose();
                handleDeleteFromState(idTask);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="text-3xl font-semibold mt-4">Delete Task</ModalHeader>
                            <ModalBody>
                                <p>
                                    Are you sure you want to delete this task?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="danger" onPress={handleDelete}>
                                    Delete
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

