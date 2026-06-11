import { NextRequest, NextResponse } from 'next/server';

// Ensure every device carries a stable, long-lived `device_id` cookie so we can
// associate it with the decisions it creates or visits.
export function proxy(req: NextRequest) {
    const res = NextResponse.next();

    if (!req.cookies.get('device_id')) {
        res.cookies.set('device_id', crypto.randomUUID(), {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: '/',
        });
    }

    return res;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
