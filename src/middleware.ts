import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import { auth } from '../firebase'
// import { useSession } from '@/context/SessionContext';

// export function middleware(request: NextRequest) {
//     const { session } = useSession();

//     if (!(session?.authenticated) && !(request.nextUrl.pathname.startsWith('/signUp'))) {
//         return NextResponse.rewrite(new URL('/signIn', request.url))
//     }
// }

// export const config = {
//     matcher: [
//         '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
//     ],
// }

export function middleware(request: NextRequest) {
    return NextResponse.next()
}