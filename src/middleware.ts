import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const token = req.cookies.get("Admin_token")?.value;

    if (pathname.startsWith('/admin')) {
        if (pathname === '/admin/login') {
            if (token) {
                return NextResponse.redirect(new URL('/admin', req.url));
            }
            return NextResponse.next();
        }
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*']
};
