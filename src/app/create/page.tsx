'use client'
import { db } from "@/app/config/firebase";
import { addDoc, collection } from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Task } from "@/types/types";

//TODO: USE GLOBAL REF COLLECTION

export default function Create() {
    const router = useRouter();

    const [task, setTask] = useState<Task>({
        id: "",
        name: "",
        description: "",
    });

    const hanldeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };


    const handleCreate = async () => {
        const coll = collection(db, "tasks");
        try {
            addDoc(coll, {
                name: task.name,
                description: task.description,
            });
            router.push("/");
        } catch (error) { 
            console.log("Error adding document: ", error);
        }
    };

    return (
        <>
            <>
                <div className="container mx-auto mt-8 max-w-[560px]">
                    <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
                        <h1 className="text-3xl font-semibold">Create Task</h1>
                    </div>
                    <form>
                        <div className="mb-4">
                            <label>Title</label>
                            <input
                                className="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full text-black"
                                type="text"
                                name="name"
                                value={task?.name}
                                onChange={hanldeChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label>Description</label>
                            <input
                                className="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full text-black"
                                type="text"
                                name="description"
                                value={task?.description}
                                onChange={hanldeChange}
                            />
                        </div>
                        <button
                            className="bg-green-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 w-full"
                            type="button"
                            onClick={handleCreate}
                        >
                            Create Task
                        </button>
                    </form>
                </div>
                <Head>
                    <title>Create Task</title>
                </Head>
            </>
        </>
    );
}
