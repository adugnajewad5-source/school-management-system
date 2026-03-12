const { spawn } = require('child_process');
const path = require('path');

console.log('Starting push process...\n');

const proc = spawn('node', ['final-push-all-fixes.js'], {
  cwd: process.cwd(),
  stdio: ['ignore', 'inherit', 'inherit'],
  shell: true,
  env: {
    ...process.env,
    GIT_TERMINAL_PROMPT: '0'
  }
});

proc.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Push process completed successfully');
  } else {
    console.log(`\n⚠️  Process exited with code ${code}`);
  }
  process.exit(code);
});

proc.on('error', (err) => {
  console.error('Error:', err);
  process.exit(1);
});
