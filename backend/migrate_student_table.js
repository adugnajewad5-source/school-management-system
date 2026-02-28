const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function migrateStudentTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Connected to database...');
    console.log('Running migration to add student pre-registration fields...\n');

    // Check if columns already exist
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'students'
    `, [process.env.DB_NAME]);

    const columnNames = columns.map(col => col.COLUMN_NAME);
    
    // Add temp_password column if it doesn't exist
    if (!columnNames.includes('temp_password')) {
      await connection.execute(`
        ALTER TABLE students 
        ADD COLUMN temp_password VARCHAR(255)
      `);
      console.log('✅ Added temp_password column');
    } else {
      console.log('ℹ️  temp_password column already exists');
    }

    // Add is_registered column if it doesn't exist
    if (!columnNames.includes('is_registered')) {
      await connection.execute(`
        ALTER TABLE students 
        ADD COLUMN is_registered BOOLEAN DEFAULT FALSE
      `);
      console.log('✅ Added is_registered column');
    } else {
      console.log('ℹ️  is_registered column already exists');
    }

    // Update existing students to mark them as registered
    await connection.execute(`
      UPDATE students 
      SET is_registered = TRUE 
      WHERE userId IS NOT NULL
    `);
    console.log('✅ Updated existing students as registered');

    // Make sure userId can be NULL (it already is)
    console.log('✅ userId already allows NULL values');

    console.log('\n✅ Migration completed successfully!');
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    process.exit(1);
  }
}

migrateStudentTable();
