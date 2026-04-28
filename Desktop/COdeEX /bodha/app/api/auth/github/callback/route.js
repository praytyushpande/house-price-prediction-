import { NextResponse } from 'next/server';

/**
 * GET /api/auth/github/callback
 * GitHub sends the user here after authorization.
 * Exchanges the temporary `code` for a permanent access_token,
 * fetches the user's GitHub profile, and stores everything in
 * secure HttpOnly cookies before redirecting back to /analyze.
 */
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    // User denied access on GitHub's side
    if (error || !code) {
        return NextResponse.redirect(`${baseUrl}/analyze?github_error=access_denied`);
    }

    try {
        // Step 1: Exchange code for access token
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: `${baseUrl}/api/auth/github/callback`,
            }),
        });

        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        if (!accessToken) {
            console.error('GitHub token exchange failed:', tokenData);
            return NextResponse.redirect(`${baseUrl}/analyze?github_error=token_failed`);
        }

        // Step 2: Fetch user profile for display in the UI
        const userRes = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github+json',
            },
        });
        const userData = await userRes.json();

        // Step 3: Set cookies and redirect back to /analyze
        const response = NextResponse.redirect(`${baseUrl}/analyze?github_connected=true`);

        const cookieOptions = {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        };

        // gh_token is HttpOnly — never readable by client-side JS (security)
        response.cookies.set('gh_token', accessToken, { ...cookieOptions, httpOnly: true });

        // gh_user and gh_avatar are readable by the browser for UI display only
        response.cookies.set('gh_user', userData.login || '', { ...cookieOptions, httpOnly: false });
        response.cookies.set('gh_avatar', userData.avatar_url || '', { ...cookieOptions, httpOnly: false });

        return response;

    } catch (err) {
        console.error('GitHub OAuth callback error:', err);
        return NextResponse.redirect(`${baseUrl}/analyze?github_error=server_error`);
    }
}
