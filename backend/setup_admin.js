const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function setupAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Setting up admin user...\n');

    const adminUsername = 'admin';
    const adminEmail = 'admin@school.com';
    const adminPassword = 'Adugna@12345';

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // First, check if username 'admin' exists
    const [userByUsername] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [adminUsername]
    );

    // Check if email exists
    const [userByEmail] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [adminEmail]
    );

    if (userByUsername.length > 0) {
      // Update existing user with username 'admin'
      await connection.execute(
        'UPDATE users SET password_hash = ?, email = ?, role = ?, must_change_password = FALSE WHERE username = ?',
        [hashedPassword, adminEmail, 'admin', adminUsername]
      );
      console.log('✅ Existing admin user updated!');
    } else if (userByEmail.length > 0) {
      // Update user with this email to have username 'admin'
      await connection.execute(
        'UPDATE users SET username = ?, password_hash = ?, role = ?, must_change_password = FALSE WHERE email = ?',
        [adminUsername, hashedPassword, 'admin', adminEmail]
      );
      console.log('✅ User with admin email updated to username "admin"!');
    } else {
      // Create new admin user
      await connection.execute(
        'INSERT INTO users (username, email, password_hash, role, must_change_password) VALUES (?, ?, ?, ?, ?)',
        [adminUsername, adminEmail, hashedPassword, 'admin', false]
      );
      console.log('✅ New admin user created!');
    }

    console.log('\n📋 Admin Login Credentials:');
    console.log(`   Username: ${adminUsername}`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('\n✅ You can now login at http://localhost:5173/');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupAdmin();
