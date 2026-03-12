const mysql = require('mysql2/promise');
require('dotenv').config();

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

    console.log('Checking database for student_id values...\n');

    // Check if student_id column exists
    const [columns] = await pool.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'students' AND COLUMN_NAME = 'student_id'
    `);
    
    if (columns.length === 0) {
      console.error('ERROR: student_id column does not exist in students table!');
      process.exit(1);
    }
    
    console.log('✓ student_id column exists');
    console.log(`  Type: ${columns[0].DATA_TYPE}`);
    console.log(`  Nullable: ${columns[0].IS_NULLABLE}\n`);

    // Check for NULL values
    const [nullCount] = await pool.execute(`
      SELECT COUNT(*) as null_count FROM students WHERE student_id IS NULL
    `);
    
    console.log(`Students with NULL student_id: ${nullCount[0].null_count}`);

    // Check for empty strings
    const [emptyCount] = await pool.execute(`
      SELECT COUNT(*) as empty_count FROM students WHERE student_id = ''
    `);
    
    console.log(`Students with empty student_id: ${emptyCount[0].empty_count}\n`);

    // Show sample data
    const [students] = await pool.execute(`
      SELECT id, student_id, name, class FROM students LIMIT 10
    `);
    
    console.log('Sample student records:');
    console.log('─'.repeat(60));
    students.forEach(s => {
      console.log(`ID: ${s.id} | student_id: ${s.student_id || 'NULL'} | Name: ${s.name} | Class: ${s.class}`);
    });
    
    console.log('─'.repeat(60));
    console.log(`\nTotal students: ${students.length}`);
    
    // Check the exact query that the API uses
    console.log('\nTesting exact API query:');
    const [apiResult] = await pool.execute(`
      SELECT s.id, s.student_id, s.user_id, s.name, s.class, s.age, s.parent_phone, s.temp_password, s.is_registered, u.username, u.email, u.id as userId
      FROM students s 
      LEFT JOIN users u ON s.user_id = u.id
      LIMIT 3
    `);
    
    console.log('API Query Result:');
    console.log(JSON.stringify(apiResult, null, 2));
    
    await pool.end();
    console.log('\n✓ Database check complete');
    
  } catch (err) {
    console.error('Database error:', err.message);
    process.exit(1);
  }
})();
