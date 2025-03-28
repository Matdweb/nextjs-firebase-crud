import { HeroUIProvider } from '@heroui/system';
import { SessionContextProvider } from '@/context/SessionContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <SessionContextProvider>
        {children}
      </SessionContextProvider>
    </HeroUIProvider>
  )
}