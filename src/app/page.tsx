'use client'
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Task } from "@/types/types";
import TableTasks from "@/components/TableTasks";
import { Button } from "@heroui/button";
import { redirect } from 'next/navigation'
import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { session } = useSession()
  const router = useRouter();

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
    getTasks();

    if (!(session.authenticated)) {
      router.push("/signIn"); //note that this is a client side redirect
    } //so the animation still loads this page and then redirects
  }, [])

  return (
    <>
      <div className="container mx-auto max-w-[560px]">
        <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
          <h1 className="text-3xl font-semibold mt-8">Tasks</h1>
          <Button
            color="primary"
            variant="shadow"
            className="mt-8"
            onPress={() => {
              redirect("/create");
            }}
          >
            New Task
          </Button>
        </div>
        <TableTasks tasks={tasks} setTasks={setTasks} />
      </div>
      <Head>
        <title>Task</title>
      </Head>
    </>
  );
}