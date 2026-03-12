const mysql = require('mysql2/promise');
require('dotenv').config();

// Enhanced migration script that handles all edge cases
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
  let connection;
  try {
    console.log('🔧 Enhanced Submissions Migration Starting...');
    
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

    connection = await pool.getConnection();
    
    // Drop table if exists (clean slate)
    console.log('🗑️ Dropping existing submissions table if exists...');
    await connection.execute('DROP TABLE IF EXISTS submissions');
    
    // Create submissions table with proper structure
    console.log('📋 Creating submissions table...');
    await connection.execute(`
      CREATE TABLE submissions (
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Submissions table created successfully');

    // Verify table structure
    const [columns] = await connection.execute('DESCRIBE submissions');
    console.log('📊 Table structure verified:');
    columns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type}`);
    });

    // Test insert and delete (to verify permissions)
    console.log('🧪 Testing table permissions...');
    const [result] = await connection.execute(
      'INSERT INTO submissions (student_id, student_name, filename, original_name, subject, message) VALUES (?, ?, ?, ?, ?, ?)',
      [999, 'Test Student', 'test.pdf', 'test.pdf', 'Test Subject', 'Test message']
    );
    
    await connection.execute('DELETE FROM submissions WHERE id = ?', [result.insertId]);
    console.log('✅ Table permissions verified');

    connection.release();
    await pool.end();
    console.log('✅ Enhanced migration completed successfully');
    
  } catch (err) {
    console.error('❌ Enhanced migration failed:', err.message);
    if (connection) connection.release();
    throw err;
  }
})();