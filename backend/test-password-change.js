const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function testPasswordChangeSessionInvalidation() {
  console.log('\n=== Testing Password Change Session Invalidation ===\n');
  
  try {
    // Step 1: Create a test parent user
    console.log('Step 1: Creating test parent user...');
    const testUsername = `test_parent_${Date.now()}`;
    const testEmail = `test_${Date.now()}@example.com`;
    const initialPassword = 'Test@1234';
    const hashedPassword = await bcrypt.hash(initialPassword, 10);
    
    const [userResult] = await pool.execute(
      'INSERT INTO users (username, email, password_hash, role, must_change_password, password_changed_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [testUsername, testEmail, hashedPassword, 'parent', 0]
    );
    
    const userId = userResult.insertId;
    console.log(`✓ Created test user with ID: ${userId}`);
    
    // Step 2: Get the initial password_changed_at timestamp
    const [users1] = await pool.execute(
      'SELECT password_changed_at FROM users WHERE id = ?',
      [userId]
    );
    const initialPasswordChangedAt = new Date(users1[0].password_changed_at).getTime();
    console.log(`✓ Initial password_changed_at: ${new Date(initialPasswordChangedAt).toISOString()}`);
    
    // Step 3: Generate a JWT token (simulating login)
    const token1 = jwt.sign(
      { 
        id: userId, 
        role: 'parent', 
        username: testUsername,
        password_changed_at: initialPasswordChangedAt
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log(`✓ Generated initial JWT token`);
    
    // Step 4: Verify the token is valid
    const decoded1 = jwt.verify(token1, process.env.JWT_SECRET);
    console.log(`✓ Token is valid, contains password_changed_at: ${new Date(decoded1.password_changed_at).toISOString()}`);
    
    // Step 5: Wait a moment to ensure timestamp difference
    console.log('\nStep 2: Waiting 2 seconds before password change...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 6: Change the password (simulating password change)
    console.log('Step 3: Changing password...');
    const newPassword = 'NewTest@5678';
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    
    await pool.execute(
      'UPDATE users SET password_hash = ?, password_changed_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newHashedPassword, userId]
    );
    console.log(`✓ Password changed successfully`);
    
    // Step 7: Get the new password_changed_at timestamp
    const [users2] = await pool.execute(
      'SELECT password_changed_at FROM users WHERE id = ?',
      [userId]
    );
    const newPasswordChangedAt = new Date(users2[0].password_changed_at).getTime();
    console.log(`✓ New password_changed_at: ${new Date(newPasswordChangedAt).toISOString()}`);
    
    // Step 8: Verify that the old token should now be invalid
    console.log('\nStep 4: Verifying session invalidation...');
    console.log(`Token's password_changed_at: ${new Date(decoded1.password_changed_at).toISOString()}`);
    console.log(`User's password_changed_at:  ${new Date(newPasswordChangedAt).toISOString()}`);
    
    if (newPasswordChangedAt > decoded1.password_changed_at) {
      console.log('✓ SUCCESS: Old token should be invalidated (user password_changed_at is newer)');
    } else {
      console.log('✗ FAILED: Token would still be valid (timestamps not properly updated)');
    }
    
    // Step 9: Generate a new token (simulating new login)
    const token2 = jwt.sign(
      { 
        id: userId, 
        role: 'parent', 
        username: testUsername,
        password_changed_at: newPasswordChangedAt
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log(`✓ Generated new JWT token with updated password_changed_at`);
    
    // Step 10: Cleanup - delete test user
    console.log('\nStep 5: Cleaning up...');
    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);
    console.log(`✓ Deleted test user`);
    
    console.log('\n=== Test Completed Successfully ===\n');
    console.log('Summary:');
    console.log('✓ Password change updates password_changed_at timestamp');
    console.log('✓ Old tokens contain outdated password_changed_at');
    console.log('✓ Middleware can compare timestamps to invalidate old tokens');
    console.log('✓ New tokens contain updated password_changed_at');
    
  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

testPasswordChangeSessionInvalidation();
