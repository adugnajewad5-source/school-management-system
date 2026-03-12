const { execSync } = require('child_process');

try {
  console.log('Testing frontend build...\n');
  const output = execSync('cd frontend && npm run build 2>&1', { encoding: 'utf-8' });
  console.log(output);
} catch (err) {
  console.error('Build failed with error:');
  console.error(err.stdout || err.message);
  process.exit(1);
}
