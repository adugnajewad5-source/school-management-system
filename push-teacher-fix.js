const { execSync } = require('child_process');

const gitPath = 'C:\\Program Files\\Git\\cmd\\git.exe';

try {
  console.log('Adding teacher registration fix...');
  execSync(`"${gitPath}" add backend/controllers/authController.js`, { stdio: 'inherit' });
  
  console.log('\nCommitting changes...');
  execSync(`"${gitPath}" commit -m "Fix teacher registration - use correct column names (user_id instead of userId)"`, { stdio: 'inherit' });
  
  console.log('\nPushing to GitHub...');
  execSync(`"${gitPath}" push origin main`, { stdio: 'inherit' });
  
  console.log('\n✓ Successfully pushed to GitHub!');
  console.log('\nRender will automatically redeploy in 2-3 minutes.');
  console.log('After deployment, you should be able to add teachers successfully.');
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
