import { NextResponse } from 'next/server';

/**
 * GET /api/auth/github
 * Redirects the user to GitHub's OAuth authorization page.
 * Requests the `repo` scope so private repositories are accessible.
 */
export async function GET() {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    if (!clientId) {
        return NextResponse.json(
            { error: 'GitHub OAuth is not configured. Add GITHUB_CLIENT_ID to your environment variables.' },
            { status: 500 }
        );
    }

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: `${baseUrl}/api/auth/github/callback`,
        scope: 'repo read:user',
        allow_signup: 'true',
    });

    return NextResponse.redirect(
        `https://github.com/login/oauth/authorize?${params.toString()}`
    );
}
