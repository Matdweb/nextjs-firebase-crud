'use client'
import { useEffect } from 'react';
import { HeroUIProvider } from '@heroui/system';
import { SessionContextProvider } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';
import { useSession } from "@/context/SessionContext";
import { usePathname } from 'next/navigation'

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session } = useSession();
  const pathname = usePathname();

  //this will play the role of a middleware, for route protection
  useEffect(() => {
    if (
      !(session.authenticated)
      && pathname !== "/signIn"
      && pathname !== "/signUp"
    ) {
      router.push("/signIn");
    }
  }, []);

  return (
    <HeroUIProvider>
      <SessionContextProvider>
        {children}
      </SessionContextProvider>
    </HeroUIProvider>
  )
}