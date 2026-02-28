const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function createOrUpdateAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Connected to database...');

    // Admin credentials
    const adminUsername = 'admin';
    const adminEmail = 'admin@school.com';
    const adminPassword = 'Adugna@12345';
    const adminName = 'System Administrator';

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Check if admin user already exists
    const [existingAdmin] = await connection.execute(
      'SELECT * FROM users WHERE username = ?',
      [adminUsername]
    );

    if (existingAdmin.length > 0) {
      // Update existing admin password
      await connection.execute(
        'UPDATE users SET password_hash = ?, email = ?, must_change_password = FALSE WHERE username = ?',
        [hashedPassword, adminEmail, adminUsername]
      );
      console.log('✅ Admin password updated successfully!');
      console.log(`Username: ${adminUsername}`);
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
    } else {
      // Create new admin user
      await connection.execute(
        'INSERT INTO users (username, email, password_hash, role, must_change_password) VALUES (?, ?, ?, ?, ?)',
        [adminUsername, adminEmail, hashedPassword, 'admin', false]
      );
      console.log('✅ Admin user created successfully!');
      console.log(`Username: ${adminUsername}`);
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
    }

    await connection.end();
    console.log('\n✅ Done! You can now login with these credentials.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createOrUpdateAdmin();
