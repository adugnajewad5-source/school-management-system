const mysql = require('mysql2/promise');
const path = require('path');

async function runMigration() {
  let connection;
  try {
    // Parse DB_HOST if it's a full URL
    let dbHost = process.env.DB_HOST || 'centerbeam.proxy.rlwy.net';
    let dbPort = process.env.DB_PORT || 58962;

    if (dbHost.includes('://')) {
      const urlMatch = dbHost.match(/@([^:]+):(\d+)/);
      if (urlMatch) {
        dbHost = urlMatch[1];
        dbPort = urlMatch[2];
      }
    }

    console.log(`Connecting to ${dbHost}:${dbPort}...`);

    const dbConfig = {
      host: dbHost,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'railway',
      port: parseInt(dbPort),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    };

    connection = await mysql.createConnection(dbConfig);
    console.log('✓ Connected to database');

    // Execute schema directly (embedded SQL)
    const statements = [
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

    console.log(`\nExecuting ${statements.length} SQL statements...\n`);

    for (const statement of statements) {
      try {
        console.log(`→ ${statement.substring(0, 50)}...`);
        await connection.execute(statement);
        console.log('  ✓ Success');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('  ℹ Already exists');
        } else {
          console.error(`  ✗ ${err.message}`);
        }
      }
    }

    console.log('\n✓ Database migration complete!');
    
    // Create admin user if it doesn't exist
    console.log('\nSetting up admin user...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    const adminQuery = `
      INSERT IGNORE INTO users (username, email, password_hash, role, must_change_password)
      VALUES ('admin', 'admin@school.com', ?, 'admin', FALSE)
    `;
    
    try {
      await connection.execute(adminQuery, [hashedPassword]);
      console.log('✓ Admin user created/verified');
      console.log('\nLogin credentials:');
      console.log('  Username: admin');
      console.log('  Password: Admin@123');
    } catch (err) {
      console.error('Admin user setup error:', err.message);
    }
    
    process.exit(0);

  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runMigration();
