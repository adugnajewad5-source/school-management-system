const { execSync } = require('child_process');

try {
  console.log('Adding changes...');
  execSync('git add -A', { stdio: 'inherit' });
  
  console.log('Committing changes...');
  execSync('git commit -m "Fix: Trigger Vercel redeploy for register page - use npm ci for cleaner install"', { stdio: 'inherit' });
  
  console.log('Pushing to GitHub...');
  execSync('git push origin main', { stdio: 'inherit' });
  
  console.log('✅ Successfully pushed to GitHub! Vercel will redeploy automatically.');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
