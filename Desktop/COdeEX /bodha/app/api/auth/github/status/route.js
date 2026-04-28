import { NextResponse } from 'next/server';

/**
 * GET /api/auth/github/status
 * Returns the current GitHub connection status.
 * Reads the HttpOnly gh_token cookie to verify connection,
 * and the readable gh_user / gh_avatar cookies for the UI.
 */
export async function GET(request) {
    const token = request.cookies.get('gh_token')?.value;
    const user = request.cookies.get('gh_user')?.value;
    const avatar = request.cookies.get('gh_avatar')?.value;

    if (!token) {
        return NextResponse.json({ connected: false });
    }

    return NextResponse.json({
        connected: true,
        user: user || null,
        avatar: avatar || null,
    });
}
