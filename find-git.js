const fs = require('fs');
const path = require('path');

const commonPaths = [
  'C:\\Program Files\\Git\\cmd\\git.exe',
  'C:\\Program Files (x86)\\Git\\cmd\\git.exe',
  'C:\\Users\\HP\\AppData\\Local\\Programs\\Git\\cmd\\git.exe'
];

for (const gitPath of commonPaths) {
  if (fs.existsSync(gitPath)) {
    console.log('Found Git at:', gitPath);
    process.exit(0);
  }
}

console.log('Git not found in common locations');
process.exit(1);
