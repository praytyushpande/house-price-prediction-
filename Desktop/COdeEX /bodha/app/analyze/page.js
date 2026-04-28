'use client';

import './analyze.css';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import HeroInput from '../components/HeroInput';
import LoadingState from '../components/LoadingState';
import ReportView from '../components/ReportView';
import ChatPanel from '../components/ChatPanel';

/**
 * Inner component that reads search params (must be inside a Suspense boundary
 * per Next.js requirements for static pre-rendering).
 */
function AnalyzeApp() {
    const [state, setState] = useState('hero'); // hero | loading | report
    const [report, setReport] = useState('');
    const [repoUrl, setRepoUrl] = useState('');
    const [repoContext, setRepoContext] = useState('');
    const [error, setError] = useState('');
    const [showChat, setShowChat] = useState(false);
    const [mode, setMode] = useState('pm'); // 'pm' | 'contributor'

    // GitHub OAuth state
    const [githubConnected, setGithubConnected] = useState(false);
    const [githubUser, setGithubUser] = useState(null);
    const [githubAvatar, setGithubAvatar] = useState(null);

    const searchParams = useSearchParams();

    // Check GitHub connection status on mount and after OAuth redirect
    useEffect(() => {
        const checkGithubStatus = async () => {
            try {
                const res = await fetch('/api/auth/github/status');
                const data = await res.json();
                if (data.connected) {
                    setGithubConnected(true);
                    setGithubUser(data.user);
                    setGithubAvatar(data.avatar);
                } else {
                    setGithubConnected(false);
                    setGithubUser(null);
                    setGithubAvatar(null);
                }
            } catch (e) {
                // silently fail — GitHub connect is optional
            }
        };

        checkGithubStatus();

        // Handle redirects from OAuth callback
        const connected = searchParams.get('github_connected');
        const oauthError = searchParams.get('github_error');

        if (connected === 'true') {
            window.history.replaceState({}, '', '/analyze');
            checkGithubStatus();
        }
        if (oauthError) {
            setError(
                oauthError === 'access_denied'
                    ? 'GitHub access was denied. Please try connecting again.'
                    : 'GitHub login failed. Please try again.'
            );
            window.history.replaceState({}, '', '/analyze');
        }
    }, [searchParams]);

    const handleGithubConnect = () => {
        window.location.href = '/api/auth/github';
    };

    const handleGithubDisconnect = async () => {
        await fetch('/api/auth/github/disconnect', { method: 'POST' });
        setGithubConnected(false);
        setGithubUser(null);
        setGithubAvatar(null);
    };

    const handleAnalyze = async (githubUrl, selectedMode) => {
        setState('loading');
        setError('');
        setRepoUrl(githubUrl);
        setMode(selectedMode);

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ githubUrl, mode: selectedMode }),
            });

            const data = await res.json();

            if (res.ok) {
                setReport(data.report);
                setRepoContext(data.repoContext || '');
                setState('report');
            } else {
                setError(data.error || 'Something went wrong. Please try again.');
                setState('hero');
            }
        } catch (err) {
            setError('Failed to connect to the server. Please try again.');
            setState('hero');
        }
    };

    return (
        <main className="main">
            {/* Ambient background */}
            <div className="ambient-bg">
                <div className={`ambient-orb ambient-orb-1 ${mode === 'contributor' ? 'orb-contributor' : ''}`} />
                <div className="ambient-orb ambient-orb-2" />
                <div className="ambient-orb ambient-orb-3" />
            </div>

            <nav className="navbar">
                <div className="nav-logo" onClick={() => window.location.reload()}>
                    <span className="nav-logo-icon">✦</span>
                    <span className="nav-logo-text">Bodha</span>
                </div>
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link"
                >
                    About
                </a>
            </nav>

            {error && (
                <div className="global-error">
                    <span>⚠️</span>
                    <p>{error}</p>
                    <button onClick={() => setError('')}>✕</button>
                </div>
            )}

            {state === 'hero' && (
                <HeroInput
                    onSubmit={handleAnalyze}
                    isLoading={false}
                    githubConnected={githubConnected}
                    githubUser={githubUser}
                    githubAvatar={githubAvatar}
                    onGithubConnect={handleGithubConnect}
                    onGithubDisconnect={handleGithubDisconnect}
                />
            )}

            {state === 'loading' && <LoadingState mode={mode} />}

            {state === 'report' && (
                <ReportView
                    report={report}
                    repoUrl={repoUrl}
                    mode={mode}
                    onStartChat={() => setShowChat(true)}
                />
            )}

            {showChat && (
                <ChatPanel
                    repoContext={repoContext}
                    mode={mode}
                    onClose={() => setShowChat(false)}
                />
            )}

            {state === 'hero' && (
                <footer className="footer">
                    <p>Built for PMs, founders, and open source contributors who want clarity, not confusion.</p>
                </footer>
            )}
        </main>
    );
}

// Wrap in Suspense — required by Next.js when using useSearchParams() in a page component
export default function Home() {
    return (
        <Suspense fallback={
            <main className="main">
                <div className="ambient-bg">
                    <div className="ambient-orb ambient-orb-1" />
                    <div className="ambient-orb ambient-orb-2" />
                </div>
            </main>
        }>
            <AnalyzeApp />
        </Suspense>
    );
}
