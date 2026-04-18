import { NextResponse } from 'next/server';
import { BODHA_CHAT_PROMPT, BODHA_CONTRIBUTOR_CHAT_PROMPT } from '@/lib/bodha-prompt';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
    try {
        const { message, repoContext, chatHistory, mode } = await request.json();
        const chatPrompt = mode === 'contributor' ? BODHA_CONTRIBUTOR_CHAT_PROMPT : BODHA_CHAT_PROMPT;

        if (!message) {
            return NextResponse.json(
                { error: 'Please provide a message.' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: 'Gemini API key not configured.' },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        // Build conversation context
        let conversationPrompt = chatPrompt;

        if (repoContext) {
            conversationPrompt += `\n\nREPO CONTEXT (summarized):\n${repoContext.substring(0, 80000)}`;
        }

        if (chatHistory && chatHistory.length > 0) {
            conversationPrompt += '\n\nPREVIOUS CONVERSATION:';
            for (const msg of chatHistory.slice(-10)) { // Keep last 10 messages
                const role = msg.role === 'user' ? 'User' : 'Bodha';
                conversationPrompt += `\n${role}: ${msg.content}`;
            }
        }

        conversationPrompt += `\n\nUser: ${message}\n\nBodha:`;

        const result = await model.generateContent(conversationPrompt);
        const response = result.response;
        const reply = response.text();

        return NextResponse.json({ reply });

    } catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json(
            { error: `Chat failed: ${error.message}` },
            { status: 500 }
        );
    }
}
