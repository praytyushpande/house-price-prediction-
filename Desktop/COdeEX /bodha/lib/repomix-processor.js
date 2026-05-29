import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * Processes a GitHub repo URL by downloading its archive via GitHub API.
 * This approach does NOT require git to be installed — safe for Vercel serverless.
 *
 * @param {string} githubUrl - Public or private GitHub repo URL
 * @param {string|null} githubToken - Optional OAuth token for private repo access
 */
export async function processRepo(githubUrl, githubToken = null) {
    // Validate GitHub URL
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/([\w.-]+)\/([\w.-]+)(\/)?$/;
    const match = githubUrl.trim().match(githubRegex);
    if (!match) {
        throw new Error('Invalid GitHub URL. Please provide a valid repository URL (e.g., https://github.com/user/repo).');
    }

    const owner = match[2];
    const repo = match[3].replace(/\/$/, '');

    // Build headers — include auth token if provided
    const headers = {
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'Bodha-App/1.0',
    };
    if (githubToken) {
        headers['Authorization'] = `Bearer ${githubToken}`;
    }

    // Step 1: Get the default branch
    let defaultBranch = 'main';
    try {
        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
        if (!repoRes.ok) {
            if (repoRes.status === 404) {
                throw new Error('Repository not found or is private. If it is private, please connect your GitHub account.');
            }
            if (repoRes.status === 403 || repoRes.status === 401) {
                throw new Error('Access denied. The repository may be private. Please connect your GitHub account.');
            }
            throw new Error(`GitHub API error: ${repoRes.status} ${repoRes.statusText}`);
        }
        const repoData = await repoRes.json();
        defaultBranch = repoData.default_branch || 'main';
    } catch (err) {
        if (err.message.includes('Repository not found') || err.message.includes('Access denied') || err.message.includes('GitHub API error')) {
            throw err;
        }
        // Network error etc — continue with 'main' as default
    }

    // Step 2: Download the archive using GitHub's tarball API (no git needed)
    const archiveUrl = `https://api.github.com/repos/${owner}/${repo}/tarball/${defaultBranch}`;

    let tarBuffer;
    try {
        const archiveRes = await fetch(archiveUrl, {
            headers: {
                ...headers,
                'Accept': 'application/vnd.github+json',
            },
        });

        if (!archiveRes.ok) {
            if (archiveRes.status === 404) {
                throw new Error('Repository not found or branch does not exist.');
            }
            if (archiveRes.status === 403 || archiveRes.status === 401) {
                throw new Error('Access denied. The repository may be private. Please connect your GitHub account.');
            }
            throw new Error(`Failed to download repository archive: ${archiveRes.status} ${archiveRes.statusText}`);
        }

        const arrayBuffer = await archiveRes.arrayBuffer();
        tarBuffer = Buffer.from(arrayBuffer);
    } catch (err) {
        if (err.message.includes('Access denied') || err.message.includes('not found') || err.message.includes('Failed to download')) {
            throw err;
        }
        throw new Error(`Network error while downloading repository: ${err.message}`);
    }

    // Step 3: Extract the tarball and build text output
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bodha-'));
    const tarPath = path.join(tempDir, 'repo.tar.gz');

    try {
        fs.writeFileSync(tarPath, tarBuffer);

        // Use Node's built-in zlib + tar extraction via child_process
        const output = await extractAndBuildOutput(tarPath, tempDir, owner, repo);

        if (!output || output.trim().length === 0) {
            throw new Error('Repository appears to be empty or contains no readable files.');
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

/**
 * Extracts a .tar.gz file and builds a repomix-style text output of file contents.
 */
async function extractAndBuildOutput(tarPath, tempDir, owner, repo) {
    const extractDir = path.join(tempDir, 'extracted');
    fs.mkdirSync(extractDir, { recursive: true });

    // Use the tar module from repomix's dependencies (it's available via node_modules)
    // or fall back to reading files via Node.js zlib + stream
    try {
        const tar = await import('tar');
        await tar.extract({
            file: tarPath,
            cwd: extractDir,
            strip: 1, // Remove the top-level directory (e.g., "owner-repo-sha/")
        });
    } catch (e) {
        // If tar module not available, try using the system tar via spawn
        const { execSync } = await import('child_process');
        try {
            execSync(`tar -xzf "${tarPath}" -C "${extractDir}" --strip-components=1`, {
                stdio: 'pipe',
                timeout: 30000,
            });
        } catch (tarErr) {
            throw new Error(`Failed to extract repository archive: ${tarErr.message}`);
        }
    }

    // Walk directory and collect file contents
    const lines = [];
    lines.push(`# Repository: ${owner}/${repo}`);
    lines.push(`# Generated by Bodha\n`);

    const IGNORED_DIRS = new Set([
        'node_modules', '.git', '.next', 'dist', 'build', '.vercel',
        '__pycache__', '.cache', 'vendor', '.pytest_cache', 'coverage',
        '.nyc_output', 'out', '.turbo', '.svelte-kit',
    ]);

    const IGNORED_EXTENSIONS = new Set([
        '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.bmp', '.tiff',
        '.mp4', '.mp3', '.wav', '.avi', '.mov', '.webm',
        '.zip', '.tar', '.gz', '.rar', '.7z',
        '.pdf', '.doc', '.docx', '.xls', '.xlsx',
        '.ttf', '.woff', '.woff2', '.eot', '.otf',
        '.lock', '.map',
        '.bin', '.exe', '.dll', '.so', '.dylib',
        '.pyc', '.pyo',
    ]);

    const MAX_FILE_SIZE = 100 * 1024; // 100KB per file
    let totalChars = 0;
    const MAX_TOTAL_CHARS = 200000;

    function walkDir(dirPath, relativePath = '') {
        if (totalChars >= MAX_TOTAL_CHARS) return;

        let entries;
        try {
            entries = fs.readdirSync(dirPath, { withFileTypes: true });
        } catch (e) {
            return;
        }

        for (const entry of entries) {
            if (totalChars >= MAX_TOTAL_CHARS) break;

            const fullPath = path.join(dirPath, entry.name);
            const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

            if (entry.isDirectory()) {
                if (!IGNORED_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
                    walkDir(fullPath, relPath);
                }
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name).toLowerCase();
                if (IGNORED_EXTENSIONS.has(ext)) continue;
                if (entry.name.startsWith('.') && !['env', '.env.example', '.eslintrc', '.babelrc', '.prettierrc'].some(n => entry.name.includes(n))) continue;

                try {
                    const stat = fs.statSync(fullPath);
                    if (stat.size > MAX_FILE_SIZE) {
                        lines.push(`\n${'='.repeat(60)}`);
                        lines.push(`File: ${relPath}`);
                        lines.push('='.repeat(60));
                        lines.push(`[File too large to include — ${(stat.size / 1024).toFixed(1)}KB]`);
                        continue;
                    }

                    const content = fs.readFileSync(fullPath, 'utf-8');
                    const fileBlock = `\n${'='.repeat(60)}\nFile: ${relPath}\n${'='.repeat(60)}\n${content}`;
                    lines.push(fileBlock);
                    totalChars += fileBlock.length;
                } catch (e) {
                    // Skip unreadable files (binary etc)
                }
            }
        }
    }

    walkDir(extractDir);

    if (totalChars >= MAX_TOTAL_CHARS) {
        lines.push('\n[... Additional files truncated — repository is very large ...]');
    }

    return lines.join('\n');
}
