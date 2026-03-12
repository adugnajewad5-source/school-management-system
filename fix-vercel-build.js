const { execSync } = require('child_process');

const gitPath = 'C:\\Program Files\\Git\\cmd\\git.exe';

try {
  console.log('Fixing Vercel build configuration...\n');
  
  console.log('Adding vercel.json...');
  execSync(`"${gitPath}" add vercel.json`, { stdio: 'inherit' });
  
  console.log('\nCommitting changes...');
  execSync(`"${gitPath}" commit -m "Fix Vercel build - add environment variable configuration"`, { stdio: 'inherit' });
  
  console.log('\nPushing to GitHub...');
  execSync(`"${gitPath}" push origin main`, { stdio: 'inherit' });
  
  console.log('\n✓ Successfully pushed to GitHub!');
  console.log('Vercel will auto-redeploy with the updated configuration.');
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
