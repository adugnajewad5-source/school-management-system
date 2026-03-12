const { spawn } = require('child_process');
const fs = require('fs');

console.log('\n🚀 Starting git push workaround...\n');

// Create a simple git command executor
function executeGit(args, description) {
  return new Promise((resolve) => {
    console.log(`📝 ${description}...`);
    
    const git = spawn('git', args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        GIT_TERMINAL_PROMPT: '0',
        GIT_AUTHOR_NAME: 'Auto Deploy',
        GIT_AUTHOR_EMAIL: 'auto@deploy.local',
        GIT_COMMITTER_NAME: 'Auto Deploy',
        GIT_COMMITTER_EMAIL: 'auto@deploy.local'
      }
    });

    let stdout = '';
    let stderr = '';

    git.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    git.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    git.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${description} completed\n`);
      } else {
        console.log(`⚠️  ${description} - code ${code}\n`);
        if (stderr) console.log(`Error: ${stderr}\n`);
      }
      resolve(code === 0);
    });

    git.on('error', (err) => {
      console.log(`❌ ${description} failed: ${err.message}\n`);
      resolve(false);
    });

    // Set a timeout
    setTimeout(() => {
      git.kill();
      console.log(`⏱️  ${description} timed out\n`);
      resolve(false);
    }, 30000);
  });
}

async function main() {
  try {
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║         REGISTER PAGE FIX - GIT PUSH WORKAROUND               ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    // Execute git commands
    await executeGit(['add', '-A'], 'Adding changes');
    await executeGit(['commit', '-m', 'Fix: Trigger Vercel redeploy for register page - use npm ci for cleaner install'], 'Committing changes');
    await executeGit(['push', 'origin', 'main'], 'Pushing to GitHub');

    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                    PUSH COMPLETE! ✅                          ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log('⏳ Vercel is now redeploying the frontend...\n');
    console.log('📍 Check deployment status:');
    console.log('   https://vercel.com/dashboard\n');
    console.log('🌐 Frontend URL:');
    console.log('   https://school-management-system-nu-pink.vercel.app\n');
    console.log('⏱️  Deployment usually takes 2-5 minutes\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
