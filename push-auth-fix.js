const { execSync } = require('child_process');

const gitPath = 'C:\\Program Files\\Git\\cmd\\git.exe';

try {
  console.log('Adding auth controller fix...');
  execSync(`"${gitPath}" add backend/controllers/authController.js`, { stdio: 'inherit' });
  
  console.log('\nCommitting changes...');
  execSync(`"${gitPath}" commit -m "Fix student registration - use correct column names (user_id, student_id)"`, { stdio: 'inherit' });
  
  console.log('\nPushing to GitHub...');
  execSync(`"${gitPath}" push origin main`, { stdio: 'inherit' });
  
  console.log('\n✓ Successfully pushed to GitHub!');
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
