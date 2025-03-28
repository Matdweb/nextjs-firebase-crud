'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { SessionContextType, SessionType } from '@/app/lib/definitions';

export const SessionContext = createContext<SessionContextType>({
    session: {
        user: null,
        authenticated: false,
        isLoading: false
    },
    setSession: () => { },
});

export function useSession() {
    return useContext(SessionContext);
}

export function SessionContextProvider({ children }: {
    children: React.ReactNode;
}) {
    const [session, setSession] = useState<SessionType>({
        user: null,
        authenticated: false,
        isLoading: false
    });

    useEffect(() => {
        console.log(session)
    }, [session])
    
// As long as "user server" is used for the actions, the following code is not functional 'cause session is handled in the server
    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //             setSession({
    //                 user: {
    //                     uid_user: user.uid,
    //                     email: user.email || "",
    //                     name: user.displayName || "",
    //                 },
    //                 authenticated: true,
    //                 isLoading: false
    //             });
    //         }
    //     })

    //     console.log(session)

    //     return () => unsubscribe();
    // }, [])

    return (
        <>
            <SessionContext.Provider value={{ session, setSession }}>
                {children}
            </SessionContext.Provider>
        </>
    )
}  
