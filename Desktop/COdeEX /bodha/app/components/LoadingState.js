'use client';

import { useState, useEffect } from 'react';

const PM_MESSAGES = [
    { text: 'Fetching repository...', icon: '📡' },
    { text: 'Reading the codebase...', icon: '📖' },
    { text: 'Mapping the architecture...', icon: '🗺️' },
    { text: 'Identifying patterns...', icon: '🔍' },
    { text: 'Translating for humans...', icon: '✨' },
    { text: 'Writing your report...', icon: '📝' },
    { text: 'Almost there...', icon: '🎯' },
];

const CONTRIBUTOR_MESSAGES = [
    { text: 'Cloning repository structure...', icon: '📡' },
    { text: 'Parsing modules and dependencies...', icon: '🔬' },
    { text: 'Mapping architecture & data flow...', icon: '🗺️' },
    { text: 'Scanning for test coverage...', icon: '🧪' },
    { text: 'Identifying contribution opportunities...', icon: '🎯' },
    { text: 'Drafting GSoC project ideas...', icon: '🏆' },
    { text: 'Inferring maintainer conventions...', icon: '📋' },
    { text: 'Compiling your contributor guide...', icon: '✅' },
];

export default function LoadingState({ mode = 'pm' }) {
    const messages = mode === 'contributor' ? CONTRIBUTOR_MESSAGES : PM_MESSAGES;
    const [messageIndex, setMessageIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const messageInterval = setInterval(() => {
            setMessageIndex((prev) =>
                prev < messages.length - 1 ? prev + 1 : prev
            );
        }, 8000);

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 92) return prev;
                return prev + Math.random() * 3;
            });
        }, 1000);

        return () => {
            clearInterval(messageInterval);
            clearInterval(progressInterval);
        };
    }, [messages.length]);

    return (
        <div className="loading-container">
            <div className="loading-card">
                <div className="loading-orb">
                    <div className="orb-ring orb-ring-1" />
                    <div className="orb-ring orb-ring-2" />
                    <div className="orb-ring orb-ring-3" />
                    <div className="orb-core">
                        {mode === 'contributor' ? '⚙️' : '✦'}
                    </div>
                </div>

                {mode === 'contributor' && (
                    <div className="loading-mode-badge">🛠️ Contributor Guide Mode</div>
                )}

                <div className="loading-message">
                    <span className="loading-icon">{messages[messageIndex].icon}</span>
                    <span className="loading-text">{messages[messageIndex].text}</span>
                </div>

                <div className="loading-progress-track">
                    <div
                        className="loading-progress-fill"
                        style={{ width: `${Math.min(progress, 95)}%` }}
                    />
                </div>

                <p className="loading-hint">
                    {mode === 'contributor'
                        ? 'Generating a deep contributor guide — this takes 45–90 seconds'
                        : 'This usually takes 30–60 seconds depending on repository size'}
                </p>
            </div>
        </div>
    );
}
