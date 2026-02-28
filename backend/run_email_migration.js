const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  try {
    console.log('Connected to database');
    
    // Read the migration file
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, '../database/migrations/add_email_to_students.sql'),
      'utf8'
    );
    
    console.log('Running migration: add_email_to_students.sql');
    await connection.query(migrationSQL);
    
    console.log('✓ Migration completed successfully!');
    console.log('✓ Email column added to students table');
    
  } catch (error) {
    console.error('Migration failed:', error.message);
  } finally {
    await connection.end();
  }
}

runMigration();
