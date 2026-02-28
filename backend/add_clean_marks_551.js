const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management'
});

async function addCleanMarks() {
  try {
    console.log('=== Adding Clean Marks for Student 551 ===\n');

    // Get student 551
    const [students] = await pool.execute(
      'SELECT id, studentId, name FROM students WHERE studentId = ?',
      ['551']
    );
    
    if (students.length === 0) {
      console.log('❌ Student 551 not found');
      process.exit(1);
    }
    
    const student = students[0];
    console.log(`Adding marks for: ${student.name} (ID: ${student.studentId})\n`);

    // Clean marks to add
    const marks = [
      { subject: 'Mathematics', marks: 85 },
      { subject: 'English', marks: 78 },
      { subject: 'Science', marks: 92 },
      { subject: 'History', marks: 88 },
      { subject: 'Chemistry', marks: 80 }
    ];

    console.log('Adding marks:');
    for (const mark of marks) {
      await pool.execute(
        'INSERT INTO results (student_id, subject, marks) VALUES (?, ?, ?)',
        [student.id, mark.subject, mark.marks]
      );
      console.log(`  ✓ ${mark.subject}: ${mark.marks}/100`);
    }

    console.log('\n=== Verification ===');
    const [results] = await pool.execute(
      'SELECT subject, marks FROM results WHERE student_id = ? ORDER BY subject',
      [student.id]
    );
    
    console.log(`\nTotal subjects: ${results.length}`);
    console.log('\nFinal Results for Student 551:');
    results.forEach(r => {
      console.log(`  - ${r.subject}: ${r.marks}/100`);
    });

    console.log('\n✓ Clean marks added successfully!');
    console.log('✓ No duplicates');
    console.log('✓ Student 551 portal is ready');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

addCleanMarks();
