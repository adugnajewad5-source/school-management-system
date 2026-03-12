const { execFileSync } = require('child_process');
const path = require('path');

const gitPath = 'C:\\Program Files\\Git\\cmd\\git.exe';
const projectRoot = process.cwd();

try {
  console.log('📦 Adding all changes...');
  execFileSync(gitPath, ['add', '-A'], { 
    cwd: projectRoot,
    stdio: 'inherit'
  });

  console.log('\n💾 Committing changes...');
  execFileSync(gitPath, ['commit', '-m', 'Fix: Student ID display in admin portal - ensure student_id is returned from API'], { 
    cwd: projectRoot,
    stdio: 'inherit'
  });

  console.log('\n🚀 Pushing to GitHub...');
  execFileSync(gitPath, ['push', 'origin', 'main'], { 
    cwd: projectRoot,
    stdio: 'inherit'
  });

  console.log('\n✅ Push successful! Vercel and Render will redeploy automatically.');
  console.log('\n⏳ Deployment status:');
  console.log('   - Vercel: https://vercel.com/dashboard');
  console.log('   - Render: https://dashboard.render.com');
  console.log('\n🔄 Expected deployment time: 5-10 minutes');
  console.log('\n📝 After deployment, hard refresh your browser (Ctrl+Shift+R) to clear cache');
  
} catch (err) {
  console.error('❌ Error:', err.message);
  process.exit(1);
}
