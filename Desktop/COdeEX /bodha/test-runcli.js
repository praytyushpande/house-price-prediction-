const { runCli } = require('repomix');

async function test() {
    try {
        console.log('Testing repomix runCli...');
        // Pass arguments just like in the CLI
        await runCli(['--remote', 'https://github.com/expressjs/express', '--output', 'test-cli-output.txt', '--style', 'plain']);
        console.log('Success! check test-cli-output.txt');
    } catch (e) {
        console.error('Failed:', e);
    }
}
test();
