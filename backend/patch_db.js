const mysql = require('mysql2/promise');

async function patchDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'school_management'
    });

    console.log('Connected to DB. Starting migration...');

    // 1. Rename 'password' to 'password_hash' and 'name' to 'username' IF they haven't been renamed.
    const [columns] = await connection.query('DESCRIBE users');
    const columnNames = columns.map(c => c.Field);

    let alterQueries = [];

    if (columnNames.includes('password') && !columnNames.includes('password_hash')) {
      await connection.query('ALTER TABLE users CHANGE password password_hash VARCHAR(255) NOT NULL');
      console.log('Renamed password to password_hash');
    }

    if (columnNames.includes('name') && !columnNames.includes('username')) {
      await connection.query('ALTER TABLE users CHANGE name username VARCHAR(255) NOT NULL');
      console.log('Renamed name to username');
    }

    if (!columnNames.includes('must_change_password')) {
      await connection.query('ALTER TABLE users ADD COLUMN must_change_password BOOLEAN DEFAULT FALSE');
      console.log('Added must_change_password');
    }

    if (!columnNames.includes('failed_attempts')) {
      await connection.query('ALTER TABLE users ADD COLUMN failed_attempts INT DEFAULT 0');
      console.log('Added failed_attempts');
    }

    if (!columnNames.includes('locked_at')) {
      await connection.query('ALTER TABLE users ADD COLUMN locked_at TIMESTAMP NULL');
      console.log('Added locked_at');
    }

    // Fix 'director' role to 'admin'
    await connection.query('UPDATE users SET role="admin" WHERE role="director"');

    // Make sure we have the required students and teachers tables as per schema
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
          id INT AUTO_INCREMENT PRIMARY KEY,
          student_id VARCHAR(20) NOT NULL UNIQUE,
          user_id INT,
          name VARCHAR(255) NOT NULL,
          class VARCHAR(50),
          age INT,
          parent_phone VARCHAR(20),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS teachers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          name VARCHAR(255) NOT NULL,
          subject VARCHAR(100),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('Database successfully patched and updated for High Security features!');
    await connection.end();
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

patchDatabase();
