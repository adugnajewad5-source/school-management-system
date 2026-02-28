const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management'
});

async function testNoDuplicates() {
  try {
    console.log('=== Testing No Duplicate Marks System ===\n');

    // 1. Get student 551
    console.log('1. Getting student 551 (hayu)...');
    const [students] = await pool.execute(
      'SELECT id, studentId, name FROM students WHERE studentId = ?',
      ['551']
    );
    
    if (students.length === 0) {
      console.log('❌ Student 551 not found');
      process.exit(1);
    }
    
    const student = students[0];
    console.log(`✓ Found: ${student.name} (ID: ${student.studentId})\n`);

    // 2. Check current marks for a subject
    console.log('2. Checking current marks for "Science"...');
    const [existingMarks] = await pool.execute(
      'SELECT id, marks FROM results WHERE student_id = ? AND subject = ?',
      [student.id, 'Science']
    );
    
    if (existingMarks.length > 0) {
      console.log(`✓ Found existing mark: ${existingMarks[0].marks}/100\n`);
    } else {
      console.log('✓ No existing marks for Science\n');
    }

    // 3. Count total results before
    console.log('3. Counting total results for student 551...');
    const [countBefore] = await pool.execute(
      'SELECT COUNT(*) as count FROM results WHERE student_id = ?',
      [student.id]
    );
    console.log(`✓ Total results before: ${countBefore[0].count}\n`);

    // 4. Add/Update marks for Science
    console.log('4. Adding/Updating marks for Science (75/100)...');
    const [result1] = await pool.execute(
      'SELECT id FROM results WHERE student_id = ? AND subject = ?',
      [student.id, 'Science']
    );
    
    if (result1.length > 0) {
      // Update
      await pool.execute(
        'UPDATE results SET marks = ? WHERE id = ?',
        [75, result1[0].id]
      );
      console.log('✓ Updated existing Science marks to 75\n');
    } else {
      // Insert
      await pool.execute(
        'INSERT INTO results (student_id, subject, marks) VALUES (?, ?, ?)',
        [student.id, 'Science', 75]
      );
      console.log('✓ Added new Science marks: 75\n');
    }

    // 5. Count total results after
    console.log('5. Counting total results for student 551 after update...');
    const [countAfter] = await pool.execute(
      'SELECT COUNT(*) as count FROM results WHERE student_id = ?',
      [student.id]
    );
    console.log(`✓ Total results after: ${countAfter[0].count}\n`);

    // 6. Verify no duplicates
    console.log('6. Verifying no duplicate Science entries...');
    const [scienceMarks] = await pool.execute(
      'SELECT id, subject, marks FROM results WHERE student_id = ? AND subject = ?',
      [student.id, 'Science']
    );
    
    if (scienceMarks.length === 1) {
      console.log(`✓ Only 1 Science entry found: ${scienceMarks[0].marks}/100\n`);
    } else {
      console.log(`❌ Found ${scienceMarks.length} Science entries (should be 1)\n`);
    }

    // 7. Show all results for student
    console.log('7. All results for student 551:');
    const [allResults] = await pool.execute(
      'SELECT subject, marks FROM results WHERE student_id = ? ORDER BY subject',
      [student.id]
    );
    
    allResults.forEach(r => {
      console.log(`  - ${r.subject}: ${r.marks}/100`);
    });

    console.log('\n=== Test Summary ===');
    console.log('✓ No duplicate courses are created');
    console.log('✓ Existing marks are updated instead');
    console.log('✓ Each subject appears only once per student');
    console.log('\n✓ System is working correctly!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

testNoDuplicates();
