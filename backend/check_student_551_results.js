const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management'
});

async function checkResults() {
  try {
    console.log('=== Checking Student 551 Results ===\n');

    // Get student info
    const [students] = await pool.execute(
      'SELECT id, studentId, name FROM students WHERE studentId = ?',
      ['551']
    );
    
    if (students.length === 0) {
      console.log('❌ Student 551 not found');
      process.exit(1);
    }
    
    const student = students[0];
    console.log(`Student: ${student.name} (ID: ${student.studentId}, DB ID: ${student.id})\n`);

    // Get all results
    const [results] = await pool.execute(`
      SELECT r.id, r.subject, r.marks, r.created_at
      FROM results r
      WHERE r.student_id = ?
      ORDER BY r.subject, r.created_at
    `, [student.id]);
    
    console.log(`Total Results: ${results.length}\n`);
    
    if (results.length === 0) {
      console.log('No results found');
      process.exit(0);
    }

    console.log('Results in Database:');
    results.forEach((r, idx) => {
      console.log(`${idx + 1}. ID: ${r.id}, Subject: ${r.subject}, Marks: ${r.marks}/100`);
      console.log(`   Created: ${r.created_at}`);
    });

    // Check for duplicates
    console.log('\n=== Checking for Duplicates ===');
    const [duplicates] = await pool.execute(`
      SELECT subject, COUNT(*) as count
      FROM results
      WHERE student_id = ?
      GROUP BY subject
      HAVING count > 1
    `, [student.id]);
    
    if (duplicates.length === 0) {
      console.log('✓ No duplicates in database');
    } else {
      console.log('❌ Found duplicates:');
      duplicates.forEach(d => {
        console.log(`  - ${d.subject}: ${d.count} entries`);
      });
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkResults();
