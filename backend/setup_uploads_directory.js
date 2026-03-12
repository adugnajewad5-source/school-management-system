const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

try {
  // Create uploads directory if it doesn't exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Created uploads directory:', uploadsDir);
  } else {
    console.log('✅ Uploads directory already exists:', uploadsDir);
  }

  // Check permissions
  fs.accessSync(uploadsDir, fs.constants.W_OK);
  console.log('✅ Uploads directory is writable');

  // List existing files
  const files = fs.readdirSync(uploadsDir);
  console.log(`📁 Current files in uploads: ${files.length}`);
  if (files.length > 0) {
    files.forEach(file => console.log(`   - ${file}`));
  }

} catch (err) {
  console.error('❌ Error setting up uploads directory:', err.message);
  process.exit(1);
}