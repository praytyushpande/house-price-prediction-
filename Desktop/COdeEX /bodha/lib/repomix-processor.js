import { runRemoteAction } from 'repomix';
import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Processes a GitHub repo URL using Repomix programmatic API.
 */
export async function processRepo(githubUrl) {
    // Validate GitHub URL
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+(\/)?$/;
    if (!githubRegex.test(githubUrl.trim())) {
        throw new Error('Invalid GitHub URL. Please provide a valid public repository URL (e.g., https://github.com/user/repo).');
    }

    // Create a temp directory for the output
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bodha-'));
    const outputFile = path.join(tempDir, 'repomix-output.txt');

    try {
        // Use repomix programmatic API instead of CLI
        // This is more stable on Vercel and avoids "npx" permission issues
        await runRemoteAction(githubUrl.trim(), {
            output: outputFile,
            style: 'plain',
            stdout: false
        });

        // Read the output
        if (!fs.existsSync(outputFile)) {
            throw new Error('Repomix did not produce output. The repository might be empty or inaccessible.');
        }

        const output = fs.readFileSync(outputFile, 'utf-8');

        if (!output || output.trim().length === 0) {
            throw new Error('Repomix produced empty output. The repository might be empty.');
        }

        // Truncate if too large for LLM context (keep ~150k chars)
        const MAX_CHARS = 150000;
        if (output.length > MAX_CHARS) {
            return output.substring(0, MAX_CHARS) + '\n\n[... output truncated for analysis — repository is very large ...]';
        }

        return output;

    } finally {
        // Cleanup temp directory
        try {
            fs.rmSync(tempDir, { recursive: true, force: true });
        } catch (e) {
            // Ignore cleanup errors
        }
    }
}
