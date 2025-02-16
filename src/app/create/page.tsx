'use client';
import { db } from "@/app/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useRouter } from 'next/navigation'

export default function Create() {
    const { push } = useRouter();
    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, description } = Object.fromEntries(new FormData(e.currentTarget));

        const coll = collection(db, "tasks");
        try {
            addDoc(coll, {
                name,
                description
            });
            push("/");
        } catch (error) {
            console.log("Error adding document: ", error);
        }
    };


    return (
        <section className="w-full max-w-xs m-auto">
            <div className="flex flex-col justify-center items-start gap-4">
                <h1 className="text-2xl font-bold text-center left-0 mt-8">Create Task</h1>
                <Form
                    className="w-full max-w-xs flex flex-col gap-4"
                    validationBehavior="native"
                    onSubmit={(e) => handleCreate(e)}
                >
                    <Input
                        isRequired
                        errorMessage="Please enter a task name"
                        label="Name"
                        labelPlacement="outside"
                        name="name"
                        placeholder="Enter a name for your Task"
                        type="text"
                    />

                    <Input
                        isRequired
                        errorMessage="Please enter a Task description"
                        label="Description"
                        labelPlacement="outside"
                        name="description"
                        placeholder="Enter a description for your Task"
                        type="text"
                    />
                    <div className="flex gap-2">
                        <Button color="primary" type="submit">
                            Create
                        </Button>
                        <Button type="reset" variant="flat">
                            Reset
                        </Button>
                    </div>
                </Form>
            </div>
        </section>
    );
}

