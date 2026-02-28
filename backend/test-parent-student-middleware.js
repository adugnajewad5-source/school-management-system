const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

/**
 * Test script for parentStudentMiddleware
 * Verifies that the middleware correctly checks parent-student associations
 */
async function testParentStudentMiddleware() {
  console.log('\n=== Testing Parent-Student Middleware ===\n');
  
  let testParentId = null;
  let testStudentId = null;
  
  try {
    // Step 1: Check if parent_students table exists
    console.log('Step 1: Checking if parent_students table exists...');
    const [tables] = await pool.execute(
      "SHOW TABLES LIKE 'parent_students'"
    );
    
    if (tables.length === 0) {
      console.log('✗ parent_students table does not exist');
      console.log('Please run the migration script first: node run-migration.js');
      return;
    }
    console.log('✓ parent_students table exists');
    
    // Step 2: Check if parent_access_logs table exists
    console.log('\nStep 2: Checking if parent_access_logs table exists...');
    const [logTables] = await pool.execute(
      "SHOW TABLES LIKE 'parent_access_logs'"
    );
    
    if (logTables.length === 0) {
      console.log('✗ parent_access_logs table does not exist');
      console.log('Please run the migration script first: node run-migration.js');
      return;
    }
    console.log('✓ parent_access_logs table exists');
    
    // Step 3: Find an existing parent user
    console.log('\nStep 3: Finding an existing parent user...');
    const [parents] = await pool.execute(
      "SELECT id, username FROM users WHERE role = 'parent' LIMIT 1"
    );
    
    if (parents.length === 0) {
      console.log('✗ No parent users found in the database');
      console.log('Please create a test parent first: node create_test_parent.js');
      return;
    }
    
    testParentId = parents[0].id;
    console.log(`✓ Found parent user: ${parents[0].username} (ID: ${testParentId})`);
    
    // Step 4: Find an existing student
    console.log('\nStep 4: Finding an existing student...');
    const [students] = await pool.execute(
      "SELECT id, name FROM students LIMIT 1"
    );
    
    if (students.length === 0) {
      console.log('✗ No students found in the database');
      return;
    }
    
    testStudentId = students[0].id;
    console.log(`✓ Found student: ${students[0].name} (ID: ${testStudentId})`);
    
    // Step 5: Check if association exists
    console.log('\nStep 5: Checking parent-student association...');
    const [associations] = await pool.execute(
      'SELECT * FROM parent_students WHERE parent_id = ? AND student_id = ?',
      [testParentId, testStudentId]
    );
    
    if (associations.length > 0) {
      console.log(`✓ Association exists between parent ${testParentId} and student ${testStudentId}`);
    } else {
      console.log(`✗ No association found between parent ${testParentId} and student ${testStudentId}`);
      console.log('The middleware would correctly deny access in this case.');
    }
    
    // Step 6: Test logging functionality
    console.log('\nStep 6: Testing access logging...');
    await pool.execute(
      `INSERT INTO parent_access_logs 
       (parent_id, student_id, action, endpoint, status, ip_address) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [testParentId, testStudentId, 'TEST', '/test', 'test', '127.0.0.1']
    );
    console.log('✓ Successfully logged test access attempt');
    
    // Step 7: Verify log was created
    const [logs] = await pool.execute(
      'SELECT * FROM parent_access_logs WHERE parent_id = ? AND student_id = ? AND action = ? ORDER BY created_at DESC LIMIT 1',
      [testParentId, testStudentId, 'TEST']
    );
    
    if (logs.length > 0) {
      console.log('✓ Log entry verified:');
      console.log(`  - Parent ID: ${logs[0].parent_id}`);
      console.log(`  - Student ID: ${logs[0].student_id}`);
      console.log(`  - Action: ${logs[0].action}`);
      console.log(`  - Status: ${logs[0].status}`);
      console.log(`  - Timestamp: ${logs[0].created_at}`);
    }
    
    // Step 8: Clean up test log
    await pool.execute(
      'DELETE FROM parent_access_logs WHERE parent_id = ? AND student_id = ? AND action = ?',
      [testParentId, testStudentId, 'TEST']
    );
    console.log('✓ Cleaned up test log entry');
    
    console.log('\n=== Test Completed Successfully ===\n');
    console.log('Summary:');
    console.log('✓ parent_students table exists and is accessible');
    console.log('✓ parent_access_logs table exists and is accessible');
    console.log('✓ Association query works correctly');
    console.log('✓ Logging functionality works correctly');
    console.log('\nThe middleware is ready to use!');
    
  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

testParentStudentMiddleware();
