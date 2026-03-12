const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Auto-pushing to GitHub...\n');

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    
    const process = spawn(command, args, {
      cwd: __dirname,
      stdio: 'inherit'
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log('✓ Command completed successfully\n');
        resolve();
      } else {
        console.error(`✗ Command failed with code ${code}\n`);
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    process.on('error', (error) => {
      console.error(`✗ Error: ${error.message}\n`);
      reject(error);
    });
  });
}

async function pushToGitHub() {
  try {
    // Step 1: Add files
    console.log('Step 1: Adding files...');
    await runCommand('git', ['add', 'backend/index.js', 'backend/run-railway-migration.js', 'backend/create_railway_tables.js']);

    // Step 2: Commit
    console.log('Step 2: Committing changes...');
    await runCommand('git', ['commit', '-m', 'Add automatic database migration on startup - creates Railway tables and admin user']);

    // Step 3: Push
    console.log('Step 3: Pushing to GitHub...');
    await runCommand('git', ['push', 'origin', 'main']);

    console.log('🎉 SUCCESS! Code pushed to GitHub\n');
    console.log('NEXT STEPS:');
    console.log('1. Go to: https://dashboard.render.com');
    console.log('2. Click your backend service');
    console.log('3. Click "Redeploy" button');
    console.log('4. Wait 2-3 minutes');
    console.log('5. Try logging in at: school-management-system-nu-pink.vercel.app');
    console.log('   Username: admin');
    console.log('   Password: Admin@123');

  } catch (error) {
    console.error('❌ Push failed:', error.message);
    console.log('\nAlternative: Run the create_tables_now.js script instead');
    console.log('This will create tables directly without needing to push code');
  }
}

pushToGitHub();