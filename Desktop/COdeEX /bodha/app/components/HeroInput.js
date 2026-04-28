'use client';

import { useState } from 'react';

const MODES = [
    {
        id: 'pm',
        label: 'PM / Founder',
        icon: '🏢',
        description: 'Plain-English report for non-technical stakeholders',
        badge: 'Original',
        examples: ['expressjs/express', 'pallets/flask', 'fastify/fastify'],
        placeholder: 'https://github.com/user/repository',
    },
    {
        id: 'contributor',
        label: 'Open Source',
        icon: '🛠️',
        description: 'Contributor guide, GSoC ideas & dev setup for developers',
        badge: 'New',
        examples: ['facebook/react', 'django/django', 'vercel/next.js'],
        placeholder: 'https://github.com/org/project-to-contribute',
    },
];

export default function HeroInput({
    onSubmit,
    isLoading,
    githubConnected = false,
    githubUser = null,
    githubAvatar = null,
    onGithubConnect,
    onGithubDisconnect,
}) {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');
    const [activeMode, setActiveMode] = useState('pm');

    const validateUrl = (input) => {
        const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\/)?$/;
        return githubRegex.test(input.trim());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!url.trim()) {
            setError('Please enter a GitHub repository URL');
            return;
        }

        if (!validateUrl(url)) {
            setError('Please enter a valid GitHub repo URL (e.g., https://github.com/user/repo)');
            return;
        }

        onSubmit(url.trim(), activeMode);
    };

    const currentMode = MODES.find((m) => m.id === activeMode);
    const inputPlaceholder = githubConnected
        ? 'Public or private GitHub repo URL'
        : currentMode.placeholder;

    return (
        <div className="hero-container">
            <div className="hero-badge">✦ Codebase intelligence for every reader</div>

            <h1 className="hero-title">
                <span className="hero-title-gradient">Bodha</span>
            </h1>

            {/* GitHub Connect Banner */}
            <div className="github-connect-wrapper">
                {githubConnected ? (
                    <div className="github-connected-badge">
                        {githubAvatar && (
                            <img
                                src={githubAvatar}
                                alt={githubUser}
                                className="github-avatar"
                            />
                        )}
                        <span className="github-connected-check">✓</span>
                        <span className="github-connected-text">
                            Connected as <strong>@{githubUser}</strong> — private repos unlocked
                        </span>
                        <button
                            className="github-disconnect-btn"
                            onClick={onGithubDisconnect}
                            title="Disconnect GitHub"
                        >
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <button
                        className="github-connect-btn"
                        onClick={onGithubConnect}
                        disabled={isLoading}
                        id="github-connect-button"
                    >
                        <svg className="github-connect-icon" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                        Connect GitHub for private repos
                        <span className="github-connect-lock">🔒</span>
                    </button>
                )}
            </div>

            {/* Mode Toggle */}
            <div className="mode-toggle-wrapper">
                <div className="mode-toggle">
                    {MODES.map((mode) => (
                        <button
                            key={mode.id}
                            id={`mode-${mode.id}`}
                            className={`mode-tab ${activeMode === mode.id ? 'mode-tab-active' : ''}`}
                            onClick={() => { setActiveMode(mode.id); setError(''); setUrl(''); }}
                            disabled={isLoading}
                        >
                            <span className="mode-tab-icon">{mode.icon}</span>
                            <span className="mode-tab-label">{mode.label}</span>
                            {mode.badge === 'New' && (
                                <span className="mode-badge-new">New</span>
                            )}
                        </button>
                    ))}
                </div>
                <p className="mode-description">{currentMode.description}</p>
            </div>

            {/* Contributor Feature Cards */}
            {activeMode === 'contributor' && (
                <div className="contributor-features">
                    {[
                        { icon: '🗺️', label: 'Architecture Map' },
                        { icon: '⚙️', label: 'Dev Setup Guide' },
                        { icon: '🎯', label: 'Contribution Radar' },
                        { icon: '🧪', label: 'Test Landscape' },
                        { icon: '🏆', label: 'GSoC Ideas' },
                        { icon: '📋', label: 'Maintainer Style' },
                    ].map((feat) => (
                        <div key={feat.label} className="contributor-feature-chip">
                            <span>{feat.icon}</span>
                            <span>{feat.label}</span>
                        </div>
                    ))}
                </div>
            )}

            {activeMode === 'pm' && (
                <p className="hero-subtitle">
                    {githubConnected
                        ? 'Paste any GitHub repo — public or private. Get a crystal-clear report in seconds.'
                        : 'Paste any public GitHub repo. Get a crystal-clear report your entire team can understand — in seconds.'}
                </p>
            )}

            <form onSubmit={handleSubmit} className="hero-form">
                <div className="input-wrapper">
                    <div className="input-icon">
                        {githubConnected ? (
                            <span style={{ fontSize: '16px' }}>🔒</span>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                            </svg>
                        )}
                    </div>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => { setUrl(e.target.value); setError(''); }}
                        placeholder={inputPlaceholder}
                        className={`hero-input ${githubConnected ? 'hero-input-private' : ''}`}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className={`hero-button ${activeMode === 'contributor' ? 'hero-button-contributor' : ''}`}
                        disabled={isLoading || !url.trim()}
                    >
                        {isLoading ? (
                            <span className="button-loading">
                                <span className="spinner" />
                                Analyzing...
                            </span>
                        ) : (
                            <>{activeMode === 'contributor' ? 'Generate Guide' : 'Analyze'}<span className="button-arrow">→</span></>
                        )}
                    </button>
                </div>
                {error && <p className="hero-error">{error}</p>}
            </form>

            <div className="hero-examples">
                <span className="examples-label">Try:</span>
                {currentMode.examples.map((repo) => (
                    <button
                        key={repo}
                        className="example-chip"
                        onClick={() => { setUrl(`https://github.com/${repo}`); setError(''); }}
                        disabled={isLoading}
                    >
                        {repo}
                    </button>
                ))}
            </div>
        </div>
    );
}
