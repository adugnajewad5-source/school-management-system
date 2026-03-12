#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

const gitPath = 'C:\\Program Files\\Git\\cmd\\git.exe';

try {
  console.log('Pushing Vercel build fix...\n');
  
  console.log('1. Adding vercel.json...');
  execSync(`"${gitPath}" add vercel.json`, { 
    cwd: process.cwd(),
    stdio: 'inherit'
  });
  
  console.log('\n2. Committing changes...');
  execSync(`"${gitPath}" commit -m "Fix Vercel build - use npm --prefix instead of cd command"`, { 
    cwd: process.cwd(),
    stdio: 'inherit'
  });
  
  console.log('\n3. Pushing to GitHub...');
  execSync(`"${gitPath}" push origin main`, { 
    cwd: process.cwd(),
    stdio: 'inherit'
  });
  
  console.log('\n✓ Successfully pushed to GitHub!');
  console.log('✓ Vercel will auto-redeploy with the updated build command.');
  console.log('\nExpected deployment time: 2-5 minutes');
  
} catch (err) {
  console.error('\n✗ Error:', err.message);
  process.exit(1);
}
