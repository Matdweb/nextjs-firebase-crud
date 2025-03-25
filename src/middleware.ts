import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '../firebase'

export function middleware(request: NextRequest) {
    if (!(auth.currentUser) && !(request.nextUrl.pathname.startsWith('/signUp'))) {
        return NextResponse.rewrite(new URL('/signIn', request.url))
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}