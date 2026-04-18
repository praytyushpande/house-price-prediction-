import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
    const apiKey = 'AIzaSyDarD9j3QZLwGFnny8CbTyYNqMcD5pauqk';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const result = await response.json();

        console.log('Available models:');
        if (result.models) {
            for (const model of result.models) {
                console.log(`- ${model.name} (${model.displayName})`);
                console.log(`  Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
            }
        } else {
            console.log('No models found or error:', result);
        }
    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
