const mysql = require('mysql2/promise');

async function createTablesNow() {
  console.log('🚀 Creating Railway database tables directly...\n');
  
  const dbConfig = {
    host: 'centerbeam.proxy.rlwy.net',
    user: 'root',
    password: 'oGGYFZAYYVfJyMReLooWEFXCiWETNGep',
    database: 'railway',
    port: 58962
  };

  let connection;
  try {
    console.log('Connecting to Railway database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✓ Connected to Railway database\n');

    // Create tables
    const tables = [
      `CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('student', 'teacher', 'admin', 'parent') NOT NULL,
        must_change_password BOOLEAN DEFAULT FALSE,
        failed_attempts INT DEFAULT 0,
        locked_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id VARCHAR(20) NOT NULL UNIQUE,
        user_id INT,
        name VARCHAR(255) NOT NULL,
        class VARCHAR(50),
        age INT,
        parent_phone VARCHAR(20),
        temp_password VARCHAR(255),
        is_registered BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        name VARCHAR(255) NOT NULL,
        subject VARCHAR(100),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        amount DECIMAL(10, 2) NOT NULL,
        date DATE NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        subject VARCHAR(100) NOT NULL,
        marks INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        UNIQUE KEY unique_student_subject (student_id, subject)
      )`,
      
      `CREATE TABLE IF NOT EXISTS attendance (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        date DATE NOT NULL,
        status ENUM('Present', 'Absent') NOT NULL,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )`
    ];

    for (let i = 0; i < tables.length; i++) {
      const tableName = ['users', 'students', 'teachers', 'payments', 'results', 'attendance'][i];
      console.log(`Creating ${tableName} table...`);
      await connection.execute(tables[i]);
      console.log(`✓ ${tableName} table created`);
    }

    // Create admin user
    console.log('\nCreating admin user...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    await connection.execute(
      `INSERT IGNORE INTO users (username, email, password_hash, role, must_change_password)
       VALUES ('admin', 'admin@school.com', ?, 'admin', FALSE)`,
      [hashedPassword]
    );
    console.log('✓ Admin user created');

    console.log('\n🎉 SUCCESS! All tables created in Railway database');
    console.log('\nYou can now login at: school-management-system-nu-pink.vercel.app');
    console.log('Username: admin');
    console.log('Password: Admin@123');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createTablesNow();