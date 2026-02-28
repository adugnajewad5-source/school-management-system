const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

async function checkAdmin() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Checking admin users...\n');

    // Get all admin users
    const [admins] = await connection.execute(
      'SELECT id, username, email, role, must_change_password FROM users WHERE role = "admin"'
    );

    if (admins.length === 0) {
      console.log('❌ No admin users found in database!');
      console.log('Run: node create_admin.js to create one.');
    } else {
      console.log('✅ Admin users found:');
      admins.forEach(admin => {
        console.log(`\n  ID: ${admin.id}`);
        console.log(`  Username: ${admin.username}`);
        console.log(`  Email: ${admin.email}`);
        console.log(`  Must Change Password: ${admin.must_change_password ? 'Yes' : 'No'}`);
      });

      // Test password for 'admin' user
      const [adminUser] = await connection.execute(
        'SELECT password_hash FROM users WHERE username = "admin"'
      );

      if (adminUser.length > 0) {
        const testPassword = 'Adugna@12345';
        const isMatch = await bcrypt.compare(testPassword, adminUser[0].password_hash);
        console.log(`\n🔐 Password test for 'admin' user:`);
        console.log(`  Testing password: ${testPassword}`);
        console.log(`  Result: ${isMatch ? '✅ CORRECT' : '❌ INCORRECT'}`);
      }
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAdmin();
