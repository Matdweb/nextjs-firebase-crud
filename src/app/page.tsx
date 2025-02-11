'use client'
import { db } from "@/app/config/firebase";
import { collection, getDocs } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Task } from "@/types/types";
import TableTasks from "@/components/TableTasks";

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
      <div className="container mx-auto max-w-[560px]">
        <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
          <h1 className="text-3xl font-semibold mt-8">Tasks</h1>
          <Link
            className="bg-green-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 mt-8"
            href="/create"
          >
            Create New
          </Link>
        </div>
        <TableTasks tasks={tasks} />
      </div>
      <Head>
        <title>Task</title>
      </Head>
    </>
  );
}