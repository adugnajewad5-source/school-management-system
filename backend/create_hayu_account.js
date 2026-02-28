const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
  createAccount();
});

function createAccount() {
  const username = 'hayu551';
  const email = 'hayu551@school.com';
  const defaultPassword = 'Hayu@123';
  const role = 'student';

  // Hash the password
  bcrypt.hash(defaultPassword, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      db.end();
      process.exit(1);
    }

    // First, create the user account
    const userQuery = 'INSERT INTO users (username, email, password_hash, role, must_change_password) VALUES (?, ?, ?, ?, ?)';
    
    db.query(userQuery, [username, email, hashedPassword, role, true], (err, userResult) => {
      if (err) {
        console.error('Error creating user:', err);
        db.end();
        process.exit(1);
      }

      const userId = userResult.insertId;
      console.log('User account created with ID:', userId);

      // Now update the student record with the userId
      const studentQuery = 'UPDATE students SET userId = ? WHERE studentId = ?';
      
      db.query(studentQuery, [userId, '551'], (err, studentResult) => {
        if (err) {
          console.error('Error updating student:', err);
          db.end();
          process.exit(1);
        }

        console.log('\n=== Account Created Successfully ===');
        console.log('Student ID: 551');
        console.log('Name: hayu');
        console.log('Username: ' + username);
        console.log('Email: ' + email);
        console.log('Default Password: ' + defaultPassword);
        console.log('Role: ' + role);
        console.log('\nNote: User must change password on first login');
        
        db.end();
      });
    });
  });
}
