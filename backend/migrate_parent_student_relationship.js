const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Parse database host - handle both full URL and domain-only formats
let dbHost = process.env.DB_HOST || 'localhost';
let dbPort = process.env.DB_PORT || 3306;

// If DB_HOST contains a full connection string, extract just the domain
if (dbHost.includes('://')) {
  // Extract domain from URL like: mysql://user:pass@domain:port/db
  const urlMatch = dbHost.match(/@([^:]+):(\d+)/);
  if (urlMatch) {
    dbHost = urlMatch[1];
    dbPort = urlMatch[2];
  }
}

const pool = mysql.createPool({
  host: dbHost,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'railway',
  port: parseInt(dbPort),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function createParentTables() {
  try {
    console.log('🔄 Starting parent tables migration...');

    // Create parents table if it doesn't exist
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS parents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        occupation VARCHAR(255),
        emergency_contact VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Parents table created/verified');

    // Create parent_students relationship table if it doesn't exist
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS parent_students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        parent_id INT NOT NULL,
        student_id INT NOT NULL,
        relationship VARCHAR(50) DEFAULT 'parent',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        UNIQUE KEY unique_parent_student (parent_id, student_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✅ Parent-Student relationship table created/verified');

    // Check if we need to add any missing columns to existing tables
    const [parentColumns] = await pool.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'parents'
    `, [process.env.DB_NAME || 'railway']);

    const existingColumns = parentColumns.map(col => col.COLUMN_NAME);

    // Add missing columns if needed
    if (!existingColumns.includes('occupation')) {
      await pool.execute('ALTER TABLE parents ADD COLUMN occupation VARCHAR(255) AFTER address');
      console.log('✅ Added occupation column to parents table');
    }

    if (!existingColumns.includes('emergency_contact')) {
      await pool.execute('ALTER TABLE parents ADD COLUMN emergency_contact VARCHAR(255) AFTER occupation');
      console.log('✅ Added emergency_contact column to parents table');
    }

    // Verify tables exist and show counts
    const [parentCount] = await pool.execute('SELECT COUNT(*) as count FROM parents');
    const [relationshipCount] = await pool.execute('SELECT COUNT(*) as count FROM parent_students');

    console.log('📊 Migration Summary:');
    console.log(`   - Parents table: ${parentCount[0].count} records`);
    console.log(`   - Parent-Student relationships: ${relationshipCount[0].count} records`);
    console.log('✅ Parent tables migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  createParentTables()
    .then(() => {
      console.log('🎉 Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { createParentTables };