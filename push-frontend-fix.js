const { execSync } = require('child_process');

const gitPath = 'C:\\Program Files\\Git\\cmd\\git.exe';

try {
  console.log('Adding frontend fixes...');
  execSync(`"${gitPath}" add frontend/src/components/PreRegisterStudent.jsx frontend/src/components/StudentTable.jsx frontend/src/components/TeacherTable.jsx frontend/src/pages/PaymentPage.jsx frontend/src/pages/ResultPage.jsx frontend/src/pages/ReportsPage.jsx`, { stdio: 'inherit' });
  
  console.log('\nCommitting changes...');
  execSync(`"${gitPath}" commit -m "Fix frontend API URLs - use environment variable instead of hardcoded localhost"`, { stdio: 'inherit' });
  
  console.log('\nPushing to GitHub...');
  execSync(`"${gitPath}" push origin main`, { stdio: 'inherit' });
  
  console.log('\n✓ Successfully pushed to GitHub!');
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
