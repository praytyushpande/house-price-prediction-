'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Mermaid from './Mermaid';

const PM_SECTION_ICONS = {
    '1': '🎯',
    '2': '🖼️',
    '3': '🗺️',
    '4': '🚶',
    '5': '🩺',
    '6': '💡',
    '7': '❓',
};

const CONTRIBUTOR_SECTION_ICONS = {
    '1': '📋',
    '2': '🗺️',
    '3': '🔬',
    '4': '⚙️',
    '5': '🎯',
    '6': '🧪',
    '7': '🏆',
    '8': '📐',
    '9': '⚠️',
};

export default function ReportView({ report, repoUrl, mode = 'pm', onStartChat }) {
    const repoName = repoUrl
        ? repoUrl.replace(/https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '')
        : 'Repository';

    const SECTION_ICONS = mode === 'contributor' ? CONTRIBUTOR_SECTION_ICONS : PM_SECTION_ICONS;

    const isContributor = mode === 'contributor';

    return (
        <div className="report-container">
            <div className="report-header">
                <button className="back-button" onClick={() => window.location.reload()}>
                    ← Analyze another repo
                </button>
                <div className="report-header-right">
                    {isContributor && (
                        <div className="report-mode-badge contributor-mode-badge">
                            🛠️ Contributor Guide
                        </div>
                    )}
                    <div className="report-repo-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                        {repoName}
                    </div>
                </div>
            </div>

            {/* Section nav pills for contributor mode */}
            {isContributor && (
                <div className="report-section-nav">
                    {[
                        { num: '1', label: 'Snapshot' },
                        { num: '2', label: 'Architecture' },
                        { num: '3', label: 'Anatomy' },
                        { num: '4', label: 'Dev Setup' },
                        { num: '5', label: 'Radar' },
                        { num: '6', label: 'Tests' },
                        { num: '7', label: 'GSoC Ideas' },
                        { num: '8', label: 'Style Guide' },
                        { num: '9', label: 'Watch Out' },
                    ].map((s) => (
                        <a key={s.num} href={`#section-${s.num}`} className="section-nav-pill">
                            <span>{CONTRIBUTOR_SECTION_ICONS[s.num]}</span>
                            <span>{s.label}</span>
                        </a>
                    ))}
                </div>
            )}

            <div className="report-content">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h2: ({ children }) => {
                            const text = String(children);
                            const sectionNum = text.match(/^(\d)\./)?.[1];
                            const icon = sectionNum ? SECTION_ICONS[sectionNum] : '📌';
                            const id = sectionNum ? `section-${sectionNum}` : undefined;
                            return (
                                <h2 id={id} className={`report-section-heading ${isContributor ? 'report-section-heading-contributor' : ''}`}>
                                    <span className="section-icon">{icon}</span>
                                    {children}
                                </h2>
                            );
                        },
                        h3: ({ children }) => (
                            <h3 className="report-subsection">{children}</h3>
                        ),
                        p: ({ children }) => {
                            const text = String(children);
                            // Highlight bottom line
                            if (text.toLowerCase().includes('bottom line') || text.toLowerCase().includes("contributor's bottom line")) {
                                return <p className="report-bottom-line">{children}</p>;
                            }
                            // Detect complexity traffic lights
                            if (text.startsWith('🟢') || text.startsWith('🟡') || text.startsWith('🔴')) {
                                const status = text.startsWith('🟢') ? 'green' : text.startsWith('🟡') ? 'yellow' : 'red';
                                return <p className={`report-traffic-light traffic-${status}`}>{children}</p>;
                            }
                            return <p>{children}</p>;
                        },
                        strong: ({ children }) => (
                            <strong className="report-bold">{children}</strong>
                        ),
                        ul: ({ children }) => (
                            <ul className="report-list">{children}</ul>
                        ),
                        ol: ({ children }) => (
                            <ol className="report-list report-list-ordered">{children}</ol>
                        ),
                        li: ({ children }) => (
                            <li className="report-list-item">{children}</li>
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="report-quote">{children}</blockquote>
                        ),
                        // Render inline code with accent styling
                        inlineCode: ({ children }) => (
                            <code className="report-inline-code">{children}</code>
                        ),
                        code: ({ node, inline, className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || '');
                            const isMermaid = match && match[1] === 'mermaid';

                            if (!inline && isMermaid) {
                                return (
                                    <div className="report-diagram-container">
                                        <Mermaid chart={String(children).replace(/\n$/, '')} />
                                    </div>
                                );
                            }

                            if (!inline) {
                                return (
                                    <div className="report-code-block">
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    </div>
                                );
                            }

                            return (
                                <code className="report-inline-code" {...props}>
                                    {children}
                                </code>
                            );
                        },
                    }}
                >
                    {report}
                </ReactMarkdown>
            </div>

            <div className={`report-chat-cta ${isContributor ? 'report-chat-cta-contributor' : ''}`}>
                <div className="chat-cta-content">
                    <span className="chat-cta-icon">{isContributor ? '🤝' : '💬'}</span>
                    <div>
                        <h3 className="chat-cta-title">
                            {isContributor
                                ? 'Ask questions about contributing'
                                : 'Have questions about this report?'}
                        </h3>
                        <p className="chat-cta-subtitle">
                            {isContributor
                                ? 'Ask Bodha about specific files, how to set up locally, or what to work on first'
                                : 'Ask Bodha anything about this codebase'}
                        </p>
                    </div>
                    <button className="chat-cta-button" onClick={onStartChat}>
                        {isContributor ? 'Ask a dev question →' : 'Start a conversation →'}
                    </button>
                </div>
            </div>
        </div>
    );
}
