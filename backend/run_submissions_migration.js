const mysql = require('mysql2/promise');
require('dotenv').config();

// This script will run on the production server (Render)
// It uses the production environment variables

let dbHost = process.env.DB_HOST || 'localhost';
let dbPort = process.env.DB_PORT || 3306;

if (dbHost.includes('://')) {
  const urlMatch = dbHost.match(/@([^:]+):(\d+)/);
  if (urlMatch) {
    dbHost = urlMatch[1];
    dbPort = urlMatch[2];
  }
}

(async () => {
  try {
    console.log('🔧 Running submissions table migration...');
    
    const pool = mysql.createPool({
      host: dbHost,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(dbPort),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Create submissions table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS submissions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          student_id INT NOT NULL,
          student_name VARCHAR(255) NOT NULL,
          filename VARCHAR(255) NOT NULL,
          original_name VARCHAR(255) NOT NULL,
          subject VARCHAR(100) DEFAULT 'General',
          message TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_student_id (student_id),
          INDEX idx_created_at (created_at)
      )
    `);

    console.log('✅ Submissions table created successfully');

    // Verify table exists
    const [tables] = await pool.execute("SHOW TABLES LIKE 'submissions'");
    if (tables.length > 0) {
      console.log('✅ Table verified in database');
      
      const [columns] = await pool.execute('DESCRIBE submissions');
      console.log('Table structure:');
      columns.forEach(col => {
        console.log(`  ${col.Field}: ${col.Type}`);
      });
    }

    await pool.end();
    console.log('✅ Migration completed successfully');
    
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    throw err;
  }
})();