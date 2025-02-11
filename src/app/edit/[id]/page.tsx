'use client';
import { db } from "@/app/config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Head from "next/head";
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

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleUpdate = async () => {
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
            <div className="container mx-auto mt-8 max-w-[560px]">
                <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
                    <h1 className="text-3xl font-semibold">Edit Task</h1>
                </div>
                <form>
                    <div className="mb-4">
                        <label>Title</label>
                        <input
                            className="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full text-black"
                            type="text"
                            name="name"
                            value={task?.name}
                            onChange={onChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label>Description</label>
                        <input
                            className="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full text-black"
                            type="text"
                            name="description"
                            value={task?.description}
                            onChange={onChange}
                        />
                    </div>
                    <button
                        className="bg-green-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 w-full"
                        type="button"
                        onClick={handleUpdate}
                    >
                        Edit Task
                    </button>
                </form>
            </div>
            <Head>
                <title>Edit Task</title>
            </Head>
        </>
    );
};

export default Edit;