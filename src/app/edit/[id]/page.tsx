'use client';
import { db } from "../../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Task } from "@/types/types";
import { useParams } from "next/navigation";

//TODO: USE GLOBAL REF COLLECTION

const Edit = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [task, setTask] = useState<Task>({
        id: "",
        name: "",
        description: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const fetchTask = async () => {
            const ref = doc(db, "tasks", (id as string));
            const snapshot = await getDoc(ref);
            setTask({ id: snapshot.id, ...snapshot.data() });
        };

        if (id) {
            fetchTask();
        }
    }, [id]);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const ref = doc(db, "tasks", (id as string));
        setDoc(ref, {
            name: task.name,
            description: task.description,
        })
            .then(() => {
                router.push("/");
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <section className="w-full max-w-xs m-auto">
                <div className="flex flex-col justify-center items-start gap-4">
                    <h1 className="text-2xl font-bold text-center left-0 mt-8">Edit Task</h1>
                    <Form
                        className="w-full max-w-xs flex flex-col gap-4"
                        validationBehavior="native"
                        onSubmit={(e) => handleUpdate(e)}
                    >
                        <Input
                            isRequired
                            errorMessage="Please enter a task name"
                            label="Name"
                            labelPlacement="outside"
                            name="name"
                            placeholder="Enter a name for your Task"
                            type="text"
                            value={task.name}
                            onChange={(e) => handleChange(e)}
                        />

                        <Input
                            isRequired
                            errorMessage="Please enter a Task description"
                            label="Description"
                            labelPlacement="outside"
                            name="description"
                            placeholder="Enter a description for your Task"
                            type="text"
                            value={task.description}
                            onChange={(e) => handleChange(e)}
                        />
                        <div className="flex gap-2">
                            <Button color="primary" type="submit">
                                Update
                            </Button>
                            <Button
                                variant="flat"
                                onPress={() => router.back()}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Form>
                </div>
            </section>
        </>
    );
};

export default Edit;