const { execSync } = require('child_process');

const gitPath = 'C:\\Program Files\\Git\\cmd\\git.exe';

try {
  console.log('Adding login page improvements...');
  execSync(`"${gitPath}" add frontend/src/pages/LoginPage.jsx`, { stdio: 'inherit' });
  
  console.log('\nCommitting changes...');
  execSync(`"${gitPath}" commit -m "Improve login page - add loading state, better error handling, and console logging"`, { stdio: 'inherit' });
  
  console.log('\nPushing to GitHub...');
  execSync(`"${gitPath}" push origin main`, { stdio: 'inherit' });
  
  console.log('\n✓ Successfully pushed to GitHub!');
  console.log('\nVercel will automatically redeploy in 2-3 minutes.');
  console.log('After deployment, try logging in with: admin / Admin@123');
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
