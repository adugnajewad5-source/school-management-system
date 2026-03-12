const { execSync } = require('child_process');

const gitPath = 'C:\\Program Files\\Git\\cmd\\git.exe';

try {
  console.log('Adding login page fixes...');
  execSync(`"${gitPath}" add frontend/src/pages/LoginPage.jsx`, { stdio: 'inherit' });
  
  console.log('\nCommitting changes...');
  execSync(`"${gitPath}" commit -m "Fix login page layout - remove fixed positioning and add responsive width"`, { stdio: 'inherit' });
  
  console.log('\nPushing to GitHub...');
  execSync(`"${gitPath}" push origin main`, { stdio: 'inherit' });
  
  console.log('\n✓ Successfully pushed to GitHub!');
  console.log('\nVercel will automatically redeploy. Check your dashboard in a few moments.');
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
