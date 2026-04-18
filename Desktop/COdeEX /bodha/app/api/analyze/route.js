import { NextResponse } from 'next/server';
import { processRepo } from '@/lib/repomix-processor';
import { BODHA_SYSTEM_PROMPT, BODHA_CONTRIBUTOR_PROMPT } from '@/lib/bodha-prompt';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const maxDuration = 120; // Allow up to 2 minutes for processing

export async function POST(request) {
    try {
        const { githubUrl, mode } = await request.json();
        const systemPrompt = mode === 'contributor' ? BODHA_CONTRIBUTOR_PROMPT : BODHA_SYSTEM_PROMPT;

        if (!githubUrl) {
            return NextResponse.json(
                { error: 'Please provide a GitHub repository URL.' },
                { status: 400 }
            );
        }

        // Step 1: Process repo with Repomix
        let repoContents;
        try {
            repoContents = await processRepo(githubUrl);
        } catch (err) {
            return NextResponse.json(
                { error: `Failed to process repository: ${err.message}` },
                { status: 400 }
            );
        }

        // Step 2: Send to Gemini with Bodha prompt
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Gemini API key not configured. Please set GEMINI_API_KEY in .env.local' },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const prompt = `${systemPrompt}\n\nREPO CONTENTS:\n\n${repoContents}`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const report = response.text();

        return NextResponse.json({
            report,
            mode,
            repoUrl: githubUrl,
            repoContext: repoContents.substring(0, 100000), // Keep truncated context for chat
        });

    } catch (error) {
        console.error('Analyze error:', error);
        return NextResponse.json(
            { error: `Analysis failed: ${error.message}` },
            { status: 500 }
        );
    }
}
