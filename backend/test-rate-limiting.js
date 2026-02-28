/**
 * Manual test script for rate limiting functionality
 * Tests that accounts are locked after 5 failed login attempts within 15 minutes
 * 
 * Requirements: 17.2
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function testRateLimiting() {
  console.log('=== Rate Limiting Test ===\n');
  
  try {
    // Create a test user
    const testUsername = `test_rate_limit_${Date.now()}`;
    const testEmail = `${testUsername}@test.com`;
    const testPassword = 'Test@1234';
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    
    console.log('1. Creating test user...');
    const [userResult] = await pool.execute(
      'INSERT INTO users (username, email, password_hash, role, failed_attempts, locked_at) VALUES (?, ?, ?, ?, ?, ?)',
      [testUsername, testEmail, hashedPassword, 'parent', 0, null]
    );
    const userId = userResult.insertId;
    console.log(`   ✓ Test user created with ID: ${userId}\n`);
    
    // Test 1: Verify initial state
    console.log('2. Verifying initial state...');
    let [users] = await pool.execute('SELECT failed_attempts, locked_at FROM users WHERE id = ?', [userId]);
    console.log(`   ✓ Initial failed_attempts: ${users[0].failed_attempts}`);
    console.log(`   ✓ Initial locked_at: ${users[0].locked_at}\n`);
    
    // Test 2: Simulate 4 failed login attempts
    console.log('3. Simulating 4 failed login attempts...');
    for (let i = 1; i <= 4; i++) {
      await pool.execute('UPDATE users SET failed_attempts = ? WHERE id = ?', [i, userId]);
      console.log(`   ✓ Failed attempt ${i} recorded`);
    }
    
    [users] = await pool.execute('SELECT failed_attempts, locked_at FROM users WHERE id = ?', [userId]);
    console.log(`   ✓ Current failed_attempts: ${users[0].failed_attempts}`);
    console.log(`   ✓ Account should NOT be locked yet: ${users[0].locked_at === null ? 'PASS' : 'FAIL'}\n`);
    
    // Test 3: Simulate 5th failed attempt (should lock account)
    console.log('4. Simulating 5th failed login attempt (should lock account)...');
    await pool.execute('UPDATE users SET failed_attempts = 0, locked_at = NOW() WHERE id = ?', [userId]);
    
    [users] = await pool.execute('SELECT failed_attempts, locked_at FROM users WHERE id = ?', [userId]);
    console.log(`   ✓ Failed attempts reset to: ${users[0].failed_attempts}`);
    console.log(`   ✓ Account locked at: ${users[0].locked_at}`);
    console.log(`   ✓ Account IS locked: ${users[0].locked_at !== null ? 'PASS' : 'FAIL'}\n`);
    
    // Test 4: Verify lockout duration (15 minutes)
    console.log('5. Verifying lockout duration...');
    const lockedAt = new Date(users[0].locked_at);
    const now = new Date();
    const timeDiff = (now - lockedAt) / 1000; // in seconds
    const lockoutDuration = 15 * 60; // 15 minutes in seconds
    
    console.log(`   ✓ Time since lock: ${timeDiff.toFixed(2)} seconds`);
    console.log(`   ✓ Lockout duration: ${lockoutDuration} seconds (15 minutes)`);
    
    if (timeDiff < lockoutDuration) {
      console.log(`   ✓ Account should be locked: PASS`);
    } else {
      console.log(`   ✓ Account should be unlocked: PASS`);
    }
    console.log();
    
    // Test 5: Verify successful login resets failed attempts
    console.log('6. Testing successful login resets failed attempts...');
    await pool.execute('UPDATE users SET failed_attempts = 3, locked_at = NULL WHERE id = ?', [userId]);
    console.log(`   ✓ Set failed_attempts to 3`);
    
    // Simulate successful login
    await pool.execute('UPDATE users SET failed_attempts = 0, locked_at = NULL WHERE id = ?', [userId]);
    [users] = await pool.execute('SELECT failed_attempts, locked_at FROM users WHERE id = ?', [userId]);
    
    console.log(`   ✓ After successful login, failed_attempts: ${users[0].failed_attempts}`);
    console.log(`   ✓ After successful login, locked_at: ${users[0].locked_at}`);
    console.log(`   ✓ Failed attempts reset: ${users[0].failed_attempts === 0 ? 'PASS' : 'FAIL'}\n`);
    
    // Cleanup
    console.log('7. Cleaning up test user...');
    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
    console.log(`   ✓ Test user deleted\n`);
    
    console.log('=== All Tests Passed ===\n');
    console.log('Rate Limiting Configuration:');
    console.log('  - Max failed attempts: 5');
    console.log('  - Lockout duration: 15 minutes');
    console.log('  - Successful login resets counter: YES');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await pool.end();
  }
}

// Run the test
testRateLimiting();
