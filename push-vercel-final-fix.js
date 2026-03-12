const { execSync } = require('child_process');

const gitPath = 'C:\\Program Files\\Git\\cmd\\git.exe';

try {
  console.log('Adding final vercel.json fix...');
  execSync(`"${gitPath}" add vercel.json`, { stdio: 'inherit' });
  
  console.log('\nCommitting changes...');
  execSync(`"${gitPath}" commit -m "Fix Vercel build configuration - correct buildCommand and outputDirectory"`, { stdio: 'inherit' });
  
  console.log('\nPushing to GitHub...');
  execSync(`"${gitPath}" push origin main`, { stdio: 'inherit' });
  
  console.log('\n✓ Successfully pushed to GitHub!');
  console.log('\nVercel will automatically redeploy. This may take 3-5 minutes.');
  console.log('Check your Vercel dashboard for deployment status.');
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
