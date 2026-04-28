import { NextResponse } from 'next/server';

/**
 * POST /api/auth/github/disconnect
 * Clears all GitHub session cookies, effectively disconnecting the user's GitHub account.
 */
export async function POST() {
    const response = NextResponse.json({ success: true });

    response.cookies.set('gh_token', '', { maxAge: 0, path: '/' });
    response.cookies.set('gh_user', '', { maxAge: 0, path: '/' });
    response.cookies.set('gh_avatar', '', { maxAge: 0, path: '/' });

    return response;
}
