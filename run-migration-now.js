const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Running submissions table migration...');

try {
  // Change to backend directory and run migration
  process.chdir('./backend');
  
  console.log('📂 Changed to backend directory');
  console.log('🔧 Running migration script...');
  
  const output = execSync('node run_submissions_migration.js', { 
    encoding: 'utf8',
    stdio: 'inherit'
  });
  
  console.log('✅ Migration completed successfully!');
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}