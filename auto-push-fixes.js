#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Auto-pushing all fixes to GitHub...\n');

try {
  console.log('Step 1: Adding files...');
  execSync('git add backend/controllers/adminController.js backend/run-railway-migration.js', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✓ Files added\n');

  console.log('Step 2: Committing changes...');
  execSync('git commit -m "Fix admin controller and migration script - correct column names and database connection"', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✓ Changes committed\n');

  console.log('Step 3: Pushing to GitHub...');
  execSync('git push origin main', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✓ Pushed to GitHub\n');

  console.log('✅ SUCCESS! All fixes pushed to GitHub\n');
  console.log('NEXT STEPS:');
  console.log('1. Go to: https://dashboard.render.com');
  console.log('2. Click your backend service');
  console.log('3. Click "Redeploy" button');
  console.log('4. Wait 2-3 minutes');
  console.log('5. Try pre-registering a student again\n');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
