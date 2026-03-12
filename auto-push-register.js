#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Set environment variables to suppress prompts
process.env.GIT_TERMINAL_PROMPT = '0';
process.env.GIT_AUTHOR_NAME = 'Auto Deploy';
process.env.GIT_AUTHOR_EMAIL = 'auto@deploy.local';
process.env.GIT_COMMITTER_NAME = 'Auto Deploy';
process.env.GIT_COMMITTER_EMAIL = 'auto@deploy.local';

function executeCommand(cmd, description) {
  try {
    console.log(`\n📝 ${description}...`);
    const output = execSync(cmd, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      env: process.env
    });
    console.log(`✅ ${description} completed`);
    if (output) console.log(output);
    return true;
  } catch (error) {
    console.error(`❌ Error during ${description}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting automated push to GitHub...\n');

  // Check git status
  try {
    const status = execSync('git status --porcelain', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      env: process.env
    });
    
    if (!status.trim()) {
      console.log('✅ No changes to commit');
      return;
    }
    
    console.log('📊 Changes detected:');
    console.log(status);
  } catch (error) {
    console.error('Error checking git status:', error.message);
  }

  // Add all changes
  if (!executeCommand('git add -A', 'Adding changes')) return;

  // Commit changes
  if (!executeCommand('git commit -m "Fix: Trigger Vercel redeploy for register page - use npm ci for cleaner install"', 'Committing changes')) return;

  // Push to GitHub
  if (!executeCommand('git push origin main', 'Pushing to GitHub')) return;

  console.log('\n🎉 Successfully pushed to GitHub!');
  console.log('⏳ Vercel will automatically redeploy the frontend...');
  console.log('📍 Check deployment at: https://school-management-system-nu-pink.vercel.app');
}

main().catch(console.error);
