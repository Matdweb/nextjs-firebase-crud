'use client'
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Task } from "@/types/types";
import TableTasks from "@/components/TableTasks";
import { Button } from "@heroui/button";
import { redirect } from 'next/navigation';
import { User } from "@heroui/user";
import { useSession } from "@/context/SessionContext";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { session, setSession } = useSession();
  const { user } = session;

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

  const signOut = async () => {
    setSession({
      user: null,
      authenticated: false,
      isLoading: false
    });

    redirect("/signIn");
  }

  useEffect(() => {
    getTasks();
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

      <User
        avatarProps={{
          src: "https://i.pravatar.cc/150",
        }}
        description={session?.user?.email}
        name={session?.user?.displayName}
        className="absolute bottom-0 right-0 m-4 cursor-pointer"
        onClick={signOut}
      />

      <Head>
        <title>Task</title>
      </Head>
    </>
  );
}