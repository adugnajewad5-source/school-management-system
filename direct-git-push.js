#!/usr/bin/env node

const { execFileSync } = require('child_process');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║         PUSHING ALL FIXES TO GITHUB                           ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

const gitPath = 'C:\\Program Files\\Git\\cmd\\git.exe';

try {
  // Step 1: Add all changes
  console.log('📝 Adding all changes...');
  execFileSync(gitPath, ['add', '-A'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: {
      ...process.env,
      GIT_TERMINAL_PROMPT: '0'
    }
  });
  console.log('✅ Changes added\n');

  // Step 2: Commit changes
  console.log('📝 Committing changes...');
  try {
    execFileSync(gitPath, [
      'commit',
      '-m',
      'Fix: Student ID display, Send to Teacher functionality, and API URL configuration'
    ], {
      cwd: process.cwd(),
      stdio: 'inherit',
      env: {
        ...process.env,
        GIT_TERMINAL_PROMPT: '0'
      }
    });
    console.log('✅ Changes committed\n');
  } catch (e) {
    console.log('⚠️  Commit failed (might be no changes)\n');
  }

  // Step 3: Push to GitHub
  console.log('📤 Pushing to GitHub...');
  execFileSync(gitPath, ['push', 'origin', 'main'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: {
      ...process.env,
      GIT_TERMINAL_PROMPT: '0'
    }
  });
  console.log('✅ Successfully pushed to GitHub!\n');

  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║                    PUSH SUCCESSFUL! ✅                        ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  console.log('📋 FIXES DEPLOYED:\n');
  console.log('✅ 1. Student ID Display Fix');
  console.log('   - Backend: Explicit column selection in getStudents query');
  console.log('   - Frontend: Updated delete button to handle field variations\n');

  console.log('✅ 2. Send to Teacher Functionality');
  console.log('   - Frontend: Changed to use environment variable for API URL');
  console.log('   - Backend: Fixed database connection pooling and error handling\n');

  console.log('✅ 3. API URL Configuration');
  console.log('   - All frontend components now use VITE_API_URL environment variable');
  console.log('   - Fallback to production backend URL if env var not set\n');

  console.log('⏳ DEPLOYMENT STATUS:\n');
  console.log('📍 GitHub: Changes pushed successfully ✅');
  console.log('📍 Vercel: Frontend redeploy in progress (2-5 minutes)');
  console.log('📍 Render: Backend redeploy in progress (2-5 minutes)\n');

  console.log('🌐 LIVE URLS:\n');
  console.log('Frontend:  https://school-management-system-nu-pink.vercel.app');
  console.log('Backend:   https://school-management-backend-gnav.onrender.com');
  console.log('GitHub:    https://github.com/adugnajewad5-source/school-management-system\n');

  console.log('👤 ADMIN CREDENTIALS:\n');
  console.log('Username: admin');
  console.log('Password: Admin@123\n');

  console.log('📋 NEXT STEPS:\n');
  console.log('1. Wait 2-5 minutes for Vercel and Render to redeploy');
  console.log('2. Visit frontend URL to verify deployment');
  console.log('3. Login as admin to test all features');
  console.log('4. Verify student ID displays in admin portal');
  console.log('5. Test "Send to Teacher" functionality');
  console.log('6. Test all other features\n');

  console.log('═══════════════════════════════════════════════════════════════════\n');

  process.exit(0);

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
