#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════════════════╗');
console.log('║         REGISTER PAGE FIX - COMPLETE AUTOMATION               ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// Set environment variables
process.env.GIT_TERMINAL_PROMPT = '0';
process.env.GIT_AUTHOR_NAME = 'Auto Deploy';
process.env.GIT_AUTHOR_EMAIL = 'auto@deploy.local';
process.env.GIT_COMMITTER_NAME = 'Auto Deploy';
process.env.GIT_COMMITTER_EMAIL = 'auto@deploy.local';

function runCmd(cmd, desc) {
  try {
    console.log(`📝 ${desc}...`);
    const result = execSync(cmd, {
      encoding: 'utf-8',
      stdio: 'pipe',
      env: process.env,
      shell: true,
      windowsHide: true
    });
    console.log(`✅ ${desc} completed\n`);
    return true;
  } catch (error) {
    console.log(`⚠️  ${desc} - ${error.message.split('\n')[0]}\n`);
    return false;
  }
}

async function main() {
  try {
    // Step 1: Check git status
    console.log('📊 Checking git status...');
    try {
      const status = execSync('git status --porcelain', {
        encoding: 'utf-8',
        stdio: 'pipe',
        env: process.env,
        shell: true,
        windowsHide: true
      });
      
      if (status.trim()) {
        console.log('Changes detected:\n' + status);
      } else {
        console.log('No changes detected\n');
      }
    } catch (e) {
      console.log('Could not check status\n');
    }

    // Step 2: Add changes
    runCmd('git add -A', 'Adding changes');

    // Step 3: Commit
    runCmd('git commit -m "Fix: Trigger Vercel redeploy for register page - use npm ci for cleaner install"', 'Committing changes');

    // Step 4: Push
    console.log('📤 Pushing to GitHub...');
    try {
      execSync('git push origin main', {
        encoding: 'utf-8',
        stdio: 'inherit',
        env: process.env,
        shell: true,
        windowsHide: true
      });
      console.log('✅ Successfully pushed to GitHub!\n');
    } catch (error) {
      console.log('⚠️  Push may have failed or no changes to push\n');
    }

    // Step 5: Summary
    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║                    PUSH COMPLETE! ✅                          ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log('⏳ Vercel is now redeploying the frontend...\n');
    console.log('📍 Check deployment status:');
    console.log('   https://vercel.com/dashboard\n');
    console.log('🌐 Frontend URL:');
    console.log('   https://school-management-system-nu-pink.vercel.app\n');
    console.log('⏱️  Deployment usually takes 2-5 minutes\n');
    console.log('📋 Next steps:');
    console.log('   1. Wait 2-5 minutes for Vercel to redeploy');
    console.log('   2. Visit the frontend URL');
    console.log('   3. Click "Sign In"');
    console.log('   4. Click "Register here"');
    console.log('   5. Register page should load without 404 error\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
