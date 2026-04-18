'use client';

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
    startOnLoad: true,
    theme: 'neutral',
    securityLevel: 'loose',
    fontFamily: 'inherit',
    flowchart: {
        htmlLabels: true,
        useMaxWidth: false,
        nodeSpacing: 50,
        rankSpacing: 60,
    }
});

export default function Mermaid({ chart }) {
    const mermaidRef = useRef(null);
    const [svg, setSvg] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!mermaidRef.current || !chart) return;

        const renderChart = async () => {
            try {
                // Generate a unique ID for the diagram
                const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                const { svg: generatedSvg } = await mermaid.render(id, chart);
                setSvg(generatedSvg);
                setError(null);
            } catch (err) {
                console.error('Mermaid render error:', err);
                setError('Failed to render architecture diagram.');
            }
        };

        renderChart();
    }, [chart]);

    if (error) {
        return (
            <div className="mermaid-error">
                <p>⚠️ {error}</p>
                <details>
                    <summary>View Source</summary>
                    <pre>{chart}</pre>
                </details>
            </div>
        );
    }

    return (
        <div
            ref={mermaidRef}
            className="mermaid-wrapper"
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
