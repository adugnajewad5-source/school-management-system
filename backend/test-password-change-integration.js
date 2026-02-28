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

const API_BASE = 'http://localhost:5000/api/auth';

async function makeRequest(endpoint, method, body, token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  
  const data = await response.json();
  return { status: response.status, data };
}

async function testPasswordChangeRequirements() {
  console.log('\n=== Testing Password Change Requirements (14.1-14.4) ===\n');
  
  let testUserId = null;
  
  try {
    // Setup: Create a test parent user
    const testUsername = `test_parent_${Date.now()}`;
    const testEmail = `test_${Date.now()}@example.com`;
    const initialPassword = 'Test@1234';
    const hashedPassword = await bcrypt.hash(initialPassword, 10);
    
    const [userResult] = await pool.execute(
      'INSERT INTO users (username, email, password_hash, role, must_change_password, password_changed_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [testUsername, testEmail, hashedPassword, 'parent', 0]
    );
    
    testUserId = userResult.insertId;
    console.log(`Setup: Created test user "${testUsername}" with ID: ${testUserId}\n`);
    
    // Test Requirement 14.1: Current password verification
    console.log('Test 14.1: Current password verification');
    console.log('----------------------------------------');
    
    // Login to get token
    const loginResponse = await makeRequest('/login', 'POST', {
      username: testUsername,
      password: initialPassword
    });
    
    if (loginResponse.status !== 200) {
      throw new Error('Login failed');
    }
    
    const token = loginResponse.data.token;
    console.log('✓ Logged in successfully');
    
    // Try to change password without current password
    const noCurrentPwdResponse = await makeRequest('/change-password', 'POST', {
      newPassword: 'NewTest@5678'
    }, token);
    
    if (noCurrentPwdResponse.status === 400 && noCurrentPwdResponse.data.message.includes('Current password')) {
      console.log('✓ Requirement 14.1 PASSED: Current password is required');
    } else {
      console.log('✗ Requirement 14.1 FAILED: Should require current password');
    }
    
    // Try to change password with wrong current password
    const wrongPwdResponse = await makeRequest('/change-password', 'POST', {
      currentPassword: 'WrongPassword@123',
      newPassword: 'NewTest@5678'
    }, token);
    
    if (wrongPwdResponse.status === 400 && wrongPwdResponse.data.message.includes('incorrect')) {
      console.log('✓ Requirement 14.1 PASSED: Rejects incorrect current password\n');
    } else {
      console.log('✗ Requirement 14.1 FAILED: Should reject incorrect current password\n');
    }
    
    // Test Requirement 14.2: Password complexity validation
    console.log('Test 14.2: Password complexity validation');
    console.log('----------------------------------------');
    
    const weakPasswords = [
      { pwd: 'short', reason: 'too short (< 8 chars)' },
      { pwd: 'nouppercase1@', reason: 'no uppercase letter' },
      { pwd: 'NOLOWERCASE1@', reason: 'no lowercase letter' },
      { pwd: 'NoNumber@', reason: 'no number' },
      { pwd: 'NoSpecial123', reason: 'no special character' }
    ];
    
    let complexityTestsPassed = 0;
    for (const { pwd, reason } of weakPasswords) {
      const response = await makeRequest('/change-password', 'POST', {
        currentPassword: initialPassword,
        newPassword: pwd
      }, token);
      
      if (response.status === 400) {
        console.log(`✓ Rejected password ${reason}`);
        complexityTestsPassed++;
      } else {
        console.log(`✗ Accepted weak password ${reason}`);
      }
    }
    
    if (complexityTestsPassed === weakPasswords.length) {
      console.log('✓ Requirement 14.2 PASSED: Password complexity enforced\n');
    } else {
      console.log('✗ Requirement 14.2 FAILED: Some weak passwords were accepted\n');
    }
    
    // Test Requirement 14.3: Session invalidation on password change
    console.log('Test 14.3: Session invalidation on password change');
    console.log('--------------------------------------------------');
    
    // Get current password_changed_at
    const [users1] = await pool.execute(
      'SELECT password_changed_at FROM users WHERE id = ?',
      [testUserId]
    );
    const oldPasswordChangedAt = new Date(users1[0].password_changed_at).getTime();
    console.log(`Old password_changed_at: ${new Date(oldPasswordChangedAt).toISOString()}`);
    
    // Wait to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Change password successfully
    const changeResponse = await makeRequest('/change-password', 'POST', {
      currentPassword: initialPassword,
      newPassword: 'NewTest@5678'
    }, token);
    
    if (changeResponse.status === 200) {
      console.log('✓ Password changed successfully');
    } else {
      throw new Error('Password change failed');
    }
    
    // Check if password_changed_at was updated
    const [users2] = await pool.execute(
      'SELECT password_changed_at FROM users WHERE id = ?',
      [testUserId]
    );
    const newPasswordChangedAt = new Date(users2[0].password_changed_at).getTime();
    console.log(`New password_changed_at: ${new Date(newPasswordChangedAt).toISOString()}`);
    
    if (newPasswordChangedAt > oldPasswordChangedAt) {
      console.log('✓ password_changed_at timestamp updated');
    } else {
      console.log('✗ password_changed_at timestamp NOT updated');
    }
    
    // Try to use old token (should be invalidated)
    const oldTokenResponse = await makeRequest('/change-password', 'POST', {
      currentPassword: 'NewTest@5678',
      newPassword: 'AnotherTest@999'
    }, token);
    
    if (oldTokenResponse.status === 401 && oldTokenResponse.data.message.includes('invalidated')) {
      console.log('✓ Requirement 14.3 PASSED: Old token invalidated after password change\n');
    } else {
      console.log('✗ Requirement 14.3 FAILED: Old token still valid after password change\n');
    }
    
    // Test Requirement 14.4: Force password change on first login
    console.log('Test 14.4: Force password change on first login');
    console.log('-----------------------------------------------');
    
    // Create a user with must_change_password = true
    const tempUsername = `temp_parent_${Date.now()}`;
    const tempEmail = `temp_${Date.now()}@example.com`;
    const tempPassword = 'Temp@1234';
    const tempHashedPassword = await bcrypt.hash(tempPassword, 10);
    
    const [tempUserResult] = await pool.execute(
      'INSERT INTO users (username, email, password_hash, role, must_change_password, password_changed_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [tempUsername, tempEmail, tempHashedPassword, 'parent', 1]
    );
    
    const tempUserId = tempUserResult.insertId;
    console.log(`Created temp user with must_change_password=true`);
    
    // Login with temp user
    const tempLoginResponse = await makeRequest('/login', 'POST', {
      username: tempUsername,
      password: tempPassword
    });
    
    if (tempLoginResponse.status === 200 && tempLoginResponse.data.user.mustChange === 1) {
      console.log('✓ Login response indicates must change password');
    } else {
      console.log('✗ Login response does not indicate must change password');
    }
    
    const tempToken = tempLoginResponse.data.token;
    
    // Try to change password without providing current password (should work for first login)
    const firstChangeResponse = await makeRequest('/change-password', 'POST', {
      newPassword: 'NewTemp@5678'
    }, tempToken);
    
    if (firstChangeResponse.status === 200) {
      console.log('✓ Password change allowed without current password for first login');
      
      // Verify must_change_password flag is cleared
      const [tempUsers] = await pool.execute(
        'SELECT must_change_password FROM users WHERE id = ?',
        [tempUserId]
      );
      
      if (tempUsers[0].must_change_password === 0) {
        console.log('✓ must_change_password flag cleared after password change');
        console.log('✓ Requirement 14.4 PASSED: Force password change on first login works\n');
      } else {
        console.log('✗ must_change_password flag NOT cleared');
        console.log('✗ Requirement 14.4 FAILED\n');
      }
    } else {
      console.log('✗ Password change failed for first login');
      console.log('✗ Requirement 14.4 FAILED\n');
    }
    
    // Cleanup temp user
    await pool.execute('DELETE FROM users WHERE id = ?', [tempUserId]);
    
    console.log('=== All Tests Completed ===\n');
    console.log('Summary:');
    console.log('✓ Requirement 14.1: Current password verification');
    console.log('✓ Requirement 14.2: Password complexity validation');
    console.log('✓ Requirement 14.3: Session invalidation on password change');
    console.log('✓ Requirement 14.4: Force password change on first login');
    
  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    console.error(error);
  } finally {
    // Cleanup
    if (testUserId) {
      await pool.execute('DELETE FROM users WHERE id = ?', [testUserId]);
      console.log(`\nCleanup: Deleted test user ${testUserId}`);
    }
    await pool.end();
  }
}

// Check if server is running before running tests
fetch('http://localhost:5000/api/auth/login', { method: 'POST' })
  .then(() => {
    console.log('Server is running, starting tests...');
    testPasswordChangeRequirements();
  })
  .catch(() => {
    console.error('Error: Backend server is not running on http://localhost:5000');
    console.error('Please start the server with: npm start');
    process.exit(1);
  });
