import { runRemoteAction } from 'repomix';
import path from 'path';
import fs from 'fs';

async function test() {
    try {
        console.log('Testing repomix runRemoteAction...');
        const result = await runRemoteAction('https://github.com/expressjs/express', {
            output: 'test-remote-output.txt',
            style: 'plain',
            stdout: false
        });
        console.log('Success!');
        if (fs.existsSync('test-remote-output.txt')) {
            console.log('Output file created.');
            fs.unlinkSync('test-remote-output.txt');
        }
    } catch (e) {
        console.error('Failed:', e);
    }
}
test();
