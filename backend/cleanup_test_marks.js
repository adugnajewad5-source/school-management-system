const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management'
});

async function cleanup() {
  try {
    console.log('=== Cleaning Up Test Marks ===\n');

    // Get student 551
    const [students] = await pool.execute(
      'SELECT id FROM students WHERE studentId = ?',
      ['551']
    );
    
    const studentId = students[0].id;

    // Find and delete test marks (subjects with underscores or timestamps)
    const [testMarks] = await pool.execute(`
      SELECT id, subject FROM results
      WHERE student_id = ? AND (subject LIKE '%_%' OR subject LIKE '%1772%')
    `, [studentId]);

    if (testMarks.length === 0) {
      console.log('✓ No test marks found');
      process.exit(0);
    }

    console.log(`Found ${testMarks.length} test mark(s) to delete:\n`);
    
    for (const mark of testMarks) {
      console.log(`Deleting: ID ${mark.id}, Subject: "${mark.subject}"`);
      await pool.execute('DELETE FROM results WHERE id = ?', [mark.id]);
    }

    console.log('\n=== Cleanup Complete ===');
    console.log('✓ Test marks removed');
    console.log('\nFinal results for student 551:');
    
    const [finalResults] = await pool.execute(
      'SELECT subject, marks FROM results WHERE student_id = ? ORDER BY subject',
      [studentId]
    );
    
    finalResults.forEach(r => {
      console.log(`  - ${r.subject}: ${r.marks}/100`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

cleanup();
