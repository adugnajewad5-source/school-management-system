const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management'
});

async function fixDuplicates() {
  try {
    console.log('=== Fixing Duplicate Marks for Student 551 ===\n');

    // 1. Get student 551
    const [students] = await pool.execute(
      'SELECT id FROM students WHERE studentId = ?',
      ['551']
    );
    
    if (students.length === 0) {
      console.log('❌ Student 551 not found');
      process.exit(1);
    }
    
    const studentId = students[0].id;
    console.log(`✓ Found student 551 (DB ID: ${studentId})\n`);

    // 2. Find duplicate subjects
    console.log('2. Finding duplicate subjects...');
    const [duplicates] = await pool.execute(`
      SELECT subject, COUNT(*) as count, GROUP_CONCAT(id) as ids, GROUP_CONCAT(marks) as marks
      FROM results
      WHERE student_id = ?
      GROUP BY subject
      HAVING count > 1
    `, [studentId]);
    
    if (duplicates.length === 0) {
      console.log('✓ No duplicates found\n');
      process.exit(0);
    }

    console.log(`✓ Found ${duplicates.length} duplicate subject(s):\n`);
    
    // 3. Fix each duplicate
    for (const dup of duplicates) {
      console.log(`  Fixing "${dup.subject}" (${dup.count} entries):`);
      console.log(`    IDs: ${dup.ids}`);
      console.log(`    Marks: ${dup.marks}`);
      
      const ids = dup.ids.split(',').map(Number);
      const marks = dup.marks.split(',').map(Number);
      
      // Keep the highest mark, delete others
      const maxMark = Math.max(...marks);
      const maxIndex = marks.indexOf(maxMark);
      const keepId = ids[maxIndex];
      
      console.log(`    Keeping: ID ${keepId} with ${maxMark} marks`);
      
      // Delete all except the one with highest marks
      for (let i = 0; i < ids.length; i++) {
        if (ids[i] !== keepId) {
          await pool.execute('DELETE FROM results WHERE id = ?', [ids[i]]);
          console.log(`    Deleted: ID ${ids[i]} with ${marks[i]} marks`);
        }
      }
      console.log();
    }

    // 4. Verify fix
    console.log('3. Verifying fix...');
    const [allResults] = await pool.execute(
      'SELECT subject, marks FROM results WHERE student_id = ? ORDER BY subject',
      [studentId]
    );
    
    console.log(`✓ Final results for student 551:\n`);
    allResults.forEach(r => {
      console.log(`  - ${r.subject}: ${r.marks}/100`);
    });

    console.log('\n=== Fix Complete ===');
    console.log('✓ All duplicates removed');
    console.log('✓ Kept highest marks for each subject');
    console.log('✓ Student 551 portal is now clean');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

fixDuplicates();
