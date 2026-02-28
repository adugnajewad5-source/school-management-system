const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management'
});

async function addConstraint() {
  try {
    console.log('=== Adding Unique Constraint to Results Table ===\n');

    // First, remove duplicates
    console.log('1. Removing any existing duplicates...');
    const [duplicates] = await pool.execute(`
      SELECT student_id, subject, MAX(id) as keep_id
      FROM results
      GROUP BY student_id, subject
      HAVING COUNT(*) > 1
    `);

    if (duplicates.length > 0) {
      console.log(`Found ${duplicates.length} duplicate(s):`);
      for (const dup of duplicates) {
        const [toDelete] = await pool.execute(`
          SELECT id FROM results
          WHERE student_id = ? AND subject = ? AND id != ?
          ORDER BY id
        `, [dup.student_id, dup.subject, dup.keep_id]);

        for (const row of toDelete) {
          await pool.execute('DELETE FROM results WHERE id = ?', [row.id]);
          console.log(`  Deleted duplicate ID: ${row.id}`);
        }
      }
    } else {
      console.log('✓ No duplicates found');
    }

    console.log('\n2. Adding unique constraint...');
    try {
      await pool.execute(`
        ALTER TABLE results 
        ADD CONSTRAINT unique_student_subject UNIQUE (student_id, subject)
      `);
      console.log('✓ Unique constraint added successfully');
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME') {
        console.log('✓ Unique constraint already exists');
      } else {
        throw err;
      }
    }

    console.log('\n=== Constraint Added ===');
    console.log('✓ Duplicates prevented');
    console.log('✓ Each student can have only one entry per subject');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

addConstraint();
