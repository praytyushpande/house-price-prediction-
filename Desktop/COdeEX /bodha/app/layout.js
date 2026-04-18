import './globals.css';

export const metadata = {
    title: 'Bodha — Understand any codebase in seconds',
    description: 'Paste a GitHub repo URL, get a crystal-clear technical report your entire team can understand. Built for PMs and non-technical founders.',
    keywords: ['codebase analysis', 'technical translator', 'code report', 'product management'],
    openGraph: {
        title: 'Bodha — Understand any codebase in seconds',
        description: 'Paste a GitHub repo. Get clarity.',
        type: 'website',
        url: 'https://bodha.in',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Syne:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
