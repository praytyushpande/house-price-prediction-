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

export default function HeroInput({ onSubmit, isLoading }) {
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

    return (
        <div className="hero-container">
            <div className="hero-badge">✦ Codebase intelligence for every reader</div>

            <h1 className="hero-title">
                <span className="hero-title-gradient">Bodha</span>
            </h1>

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
                    Paste any public GitHub repo. Get a crystal-clear report
                    your entire team can understand — in seconds.
                </p>
            )}

            <form onSubmit={handleSubmit} className="hero-form">
                <div className="input-wrapper">
                    <div className="input-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => { setUrl(e.target.value); setError(''); }}
                        placeholder={currentMode.placeholder}
                        className="hero-input"
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
