'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PM_SUGGESTED_QUESTIONS = [
    "What's the riskiest part of this codebase?",
    "How hard would it be to add authentication?",
    "What should we prioritize fixing first?",
];

const CONTRIBUTOR_SUGGESTED_QUESTIONS = [
    "Where should I start as a first-time contributor?",
    "Which files should I read before making a PR?",
    "What's the easiest area to contribute to?",
    "How do I set up the dev environment?",
    "Which parts need more test coverage?",
    "What would make a good GSoC project proposal?",
];

export default function ChatPanel({ repoContext, mode = 'pm', onClose }) {
    const isContributor = mode === 'contributor';

    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: isContributor
                ? "Hey! 👋 I've analyzed this codebase from a contributor's perspective. Ask me anything — where to start, which files to read, how to set up locally, what makes a good GSoC proposal, or where tests are thin. I'll be specific and point you to real file paths."
                : "Hey! 👋 I've just finished analyzing this codebase. Ask me anything — how something works, what a specific part does, where the risks are, or what you should prioritize next. I'll keep it in plain English.",
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');

        const updatedMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(updatedMessages);
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    repoContext,
                    mode,
                    chatHistory: updatedMessages.slice(1),
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    { role: 'assistant', content: `Sorry, something went wrong: ${data.error}` },
                ]);
            }
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: "Sorry, I couldn't connect to the server. Please try again." },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestedQuestions = isContributor ? CONTRIBUTOR_SUGGESTED_QUESTIONS : PM_SUGGESTED_QUESTIONS;

    return (
        <div className={`chat-panel ${isContributor ? 'chat-panel-contributor' : ''}`}>
            <div className="chat-header">
                <div className="chat-header-left">
                    <span className="chat-avatar">{isContributor ? '🛠️' : '✦'}</span>
                    <div>
                        <h3 className="chat-title">
                            {isContributor ? 'Contributor Assistant' : 'Chat with Bodha'}
                        </h3>
                        <p className="chat-subtitle">
                            {isContributor
                                ? 'Ask anything about contributing to this codebase'
                                : 'Ask follow-up questions about this codebase'}
                        </p>
                    </div>
                </div>
                <button className="chat-close" onClick={onClose}>✕</button>
            </div>

            <div className="chat-messages">
                {messages.map((msg, i) => (
                    <div key={i} className={`chat-message chat-message-${msg.role}`}>
                        {msg.role === 'assistant' && (
                            <span className="chat-msg-avatar">{isContributor ? '🛠️' : '✦'}</span>
                        )}
                        <div className="chat-msg-content">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="chat-message chat-message-assistant">
                        <span className="chat-msg-avatar">{isContributor ? '🛠️' : '✦'}</span>
                        <div className="chat-msg-content">
                            <div className="chat-typing">
                                <span /><span /><span />
                            </div>
                        </div>
                    </div>
                )}

                {messages.length === 1 && (
                    <div className="chat-suggestions">
                        {suggestedQuestions.map((q, i) => (
                            <button
                                key={i}
                                className={`suggestion-chip ${isContributor ? 'suggestion-chip-contributor' : ''}`}
                                onClick={() => {
                                    setInput(q);
                                    inputRef.current?.focus();
                                }}
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="chat-input-form">
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                        isContributor
                            ? 'Ask about files, setup, contribution areas...'
                            : 'Ask anything about this codebase...'
                    }
                    className="chat-input"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="chat-send"
                    disabled={isLoading || !input.trim()}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                </button>
            </form>
        </div>
    );
}
