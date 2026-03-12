const { execSync } = require('child_process');

const gitPath = 'C:\\Program Files\\Git\\cmd\\git.exe';

try {
  console.log('Adding files...');
  execSync(`"${gitPath}" add backend/index.js backend/run-railway-migration.js backend/create_railway_tables.js backend/controllers/adminController.js`, { stdio: 'inherit' });
  
  console.log('\nCommitting changes...');
  execSync(`"${gitPath}" commit -m "Fix admin controller column names and database connection parsing for Railway"`, { stdio: 'inherit' });
  
  console.log('\nPushing to GitHub...');
  execSync(`"${gitPath}" push origin main`, { stdio: 'inherit' });
  
  console.log('\n✓ Successfully pushed to GitHub!');
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
