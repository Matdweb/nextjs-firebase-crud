'use client'
import { db } from "@/app/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Task } from "@/types/types";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const getTasks = async () => {
    try {
      const coll = collection(db, "tasks");
      const snapshot = await getDocs(coll);
      setTasks(snapshot.docs.map(doc => {
        return {
          id: doc.id,
          ...doc.data()
        }
      }));
    } catch (error) {
      console.log("Error fetching tasks: ", error);
    }
  }

  useEffect(() => {
    getTasks()
  }, [])

  return (
    <>
      <div className="container mx-auto mt-8 max-w-[560px]">
        <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
          <h1 className="text-3xl font-semibold">Tasks</h1>
          <Link
            className="bg-green-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200"
            href="/create"
          >
            Create New
          </Link>
        </div>
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="py-2 flex justify-between w-full">
              <span>
                <strong>{task.name}</strong> - {task.description}
              </span>
              <span className="flex gap-2">
                <Link className="text-blue-700 underline hover:no-underline" href={`/edit/${task.id}`}>Edit</Link>
                <Link className="text-red-500 underline hover:no-underline" href={`/delete/${task.id}`}>Delete</Link>
              </span>
            </li>
          ))}
          {tasks?.length < 1 && <div className="py-2">No data</div>}
        </ul>
      </div>
      <Head>
        <title>Task</title>
      </Head>
    </>
  );
}