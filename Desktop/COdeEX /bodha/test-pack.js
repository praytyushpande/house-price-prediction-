const { pack } = require('repomix');

async function test() {
    try {
        console.log('Testing repomix pack with array...');
        const result = await pack([process.cwd()], {
            remote: 'https://github.com/expressjs/express',
            output: {
                filePath: 'test-pack-output.txt',
                style: 'plain'
            }
        });
        console.log('Success!', result);
    } catch (e) {
        console.error('Failed:', e);
    }
}
test();
