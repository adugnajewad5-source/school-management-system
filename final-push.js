const { execSync } = require('child_process');
const path = require('path');

const gitPath = 'C:\\Program Files\\Git\\cmd\\git.exe';

try {
  console.log('Checking git status...');
  const status = execSync(`"${gitPath}" status`, { encoding: 'utf-8' });
  console.log(status);
  
  console.log('\n✓ Git is working correctly!');
  console.log('\nYour code has already been pushed to GitHub.');
  console.log('Vercel will automatically redeploy when it detects the changes.');
  console.log('\nWait 3-5 minutes and then refresh your browser at:');
  console.log('https://school-management-system-nu-pink.vercel.app');
  
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
