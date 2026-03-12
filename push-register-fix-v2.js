const { spawn } = require('child_process');

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' }
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  try {
    console.log('Adding changes...');
    await runCommand('git', ['add', '-A']);
    
    console.log('Committing changes...');
    await runCommand('git', ['commit', '-m', 'Fix: Trigger Vercel redeploy for register page - use npm ci for cleaner install']);
    
    console.log('Pushing to GitHub...');
    await runCommand('git', ['push', 'origin', 'main']);
    
    console.log('✅ Successfully pushed to GitHub! Vercel will redeploy automatically.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
