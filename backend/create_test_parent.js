const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function createTestParent() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Creating test parent account...\n');

    // Parent credentials
    const parentUsername = 'parent_test';
    const parentEmail = 'parent@test.com';
    const parentPassword = 'Parent@123';

    // Hash the password
    const hashedPassword = await bcrypt.hash(parentPassword, 10);

    // Check if parent already exists
    const [existingParent] = await connection.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [parentUsername, parentEmail]
    );

    let parentId;

    if (existingParent.length > 0) {
      // Update existing parent
      await connection.execute(
        'UPDATE users SET password_hash = ?, must_change_password = FALSE WHERE username = ? OR email = ?',
        [hashedPassword, parentUsername, parentEmail]
      );
      parentId = existingParent[0].id;
      console.log('✅ Test parent account updated!');
    } else {
      // Create new parent
      const [result] = await connection.execute(
        'INSERT INTO users (username, email, password_hash, role, must_change_password) VALUES (?, ?, ?, ?, ?)',
        [parentUsername, parentEmail, hashedPassword, 'parent', false]
      );
      parentId = result.insertId;
      console.log('✅ Test parent account created!');
    }

    // Link parent to first student (if exists)
    const [students] = await connection.execute('SELECT id, name FROM students LIMIT 1');
    
    if (students.length > 0) {
      const studentId = students[0].id;
      const studentName = students[0].name;
      
      // Check if association already exists
      const [existingAssoc] = await connection.execute(
        'SELECT * FROM parent_students WHERE parent_id = ? AND student_id = ?',
        [parentId, studentId]
      );
      
      if (existingAssoc.length === 0) {
        await connection.execute(
          'INSERT INTO parent_students (parent_id, student_id) VALUES (?, ?)',
          [parentId, studentId]
        );
        console.log(`✅ Linked parent to student: ${studentName}`);
      } else {
        console.log(`ℹ️  Parent already linked to student: ${studentName}`);
      }
    } else {
      console.log('⚠️  No students found to link to parent');
    }

    console.log('\n📋 Test Parent Login Credentials:');
    console.log(`   Username: ${parentUsername}`);
    console.log(`   Email: ${parentEmail}`);
    console.log(`   Password: ${parentPassword}`);
    console.log('\n✅ You can now login at http://localhost:5173/');
    console.log('   The parent portal will be accessible at /parent-dashboard');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestParent();
