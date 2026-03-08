#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║                  PUSHING TO GITHUB                            ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log('');

try {
  console.log('Step 1: Adding all files...');
  execSync('git add .', { stdio: 'inherit', cwd: process.cwd() });
  console.log('✅ Files added\n');

  console.log('Step 2: Committing changes...');
  execSync('git commit -m "Fix SSL/TLS for PlanetScale database connection"', { 
    stdio: 'inherit', 
    cwd: process.cwd() 
  });
  console.log('✅ Changes committed\n');

  console.log('Step 3: Pushing to GitHub...');
  execSync('git push origin main', { stdio: 'inherit', cwd: process.cwd() });
  console.log('✅ Pushed to GitHub\n');

  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║                  SUCCESS! PUSHED TO GITHUB                    ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Next steps:');
  console.log('1. Go to: https://dashboard.render.com');
  console.log('2. Click: school-management-backend-gnav');
  console.log('3. Click: "Redeploy" button');
  console.log('4. Wait 2-3 minutes');
  console.log('5. Check logs for: "Connected to MySQL database"');
  console.log('');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
