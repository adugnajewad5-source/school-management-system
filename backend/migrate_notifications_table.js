const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Parse database host - handle both full URL and domain-only formats
let dbHost = process.env.DB_HOST || 'localhost';
let dbPort = process.env.DB_PORT || 3306;

// If DB_HOST contains a full connection string, extract just the domain
if (dbHost.includes('://')) {
  const urlMatch = dbHost.match(/@([^:]+):(\d+)/);
  if (urlMatch) {
    dbHost = urlMatch[1];
    dbPort = urlMatch[2];
  }
}

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

async function migrateNotificationsTable() {
  try {
    console.log('🔄 Starting notifications table migration...');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '..', 'database', 'migrations', 'add_notifications_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    console.log('⚡ Creating notifications table...');
    await pool.execute(migrationSQL);
    console.log('✅ Notifications table created successfully');
    
    // Verify the migration
    console.log('🔍 Verifying notifications table...');
    const [tables] = await pool.execute(`
      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'notifications'
    `, [process.env.DB_NAME]);
    
    if (tables.length > 0) {
      console.log('✅ Notifications table verified successfully!');
      
      // Show table structure
      const [columns] = await pool.execute(`
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'notifications'
        ORDER BY ORDINAL_POSITION
      `, [process.env.DB_NAME]);
      
      console.log('📊 Notifications table structure:');
      columns.forEach(col => {
        console.log(`  - ${col.COLUMN_NAME} (${col.DATA_TYPE}): ${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'} ${col.COLUMN_DEFAULT ? `DEFAULT ${col.COLUMN_DEFAULT}` : ''}`);
      });
    } else {
      throw new Error('Notifications table was not created');
    }
    
    console.log('✅ Notifications table migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateNotificationsTable()
    .then(() => {
      console.log('🎉 Notifications migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Notifications migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateNotificationsTable };