const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management'
});

async function runMigration() {
  try {
    const migrationFile = path.join(__dirname, '../database/migrations/add_notifications_table.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');
    
    const connection = await pool.getConnection();
    await connection.query(sql);
    connection.release();
    
    console.log('✓ Notifications table created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

runMigration();
