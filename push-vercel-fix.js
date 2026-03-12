const { execSync } = require('child_process');

const gitPath = 'C:\\Program Files\\Git\\cmd\\git.exe';

try {
  console.log('Adding vercel.json fix...');
  execSync(`"${gitPath}" add vercel.json`, { stdio: 'inherit' });
  
  console.log('\nCommitting changes...');
  execSync(`"${gitPath}" commit -m "Fix Vercel deployment configuration - use correct build command"`, { stdio: 'inherit' });
  
  console.log('\nPushing to GitHub...');
  execSync(`"${gitPath}" push origin main`, { stdio: 'inherit' });
  
  console.log('\n✓ Successfully pushed to GitHub!');
  console.log('\nVercel will automatically redeploy when it detects the new push.');
  console.log('Check your Vercel dashboard in a few moments for the deployment status.');
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
