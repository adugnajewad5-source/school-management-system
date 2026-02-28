const mysql = require('mysql2');
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
  getUsername();
});

function getUsername() {
  const query = `
    SELECT s.studentId, s.name, u.username, u.email, u.role
    FROM students s
    LEFT JOIN users u ON s.userId = u.id
    WHERE s.studentId = '551'
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching student:', err);
      db.end();
      process.exit(1);
    }
    
    if (results.length === 0) {
      console.log('Student not found');
    } else {
      const student = results[0];
      console.log('\n=== Student Information ===');
      console.log('Student ID:', student.studentId);
      console.log('Name:', student.name);
      console.log('Username:', student.username || 'Not registered yet');
      console.log('Email:', student.email || 'Not set');
      console.log('Role:', student.role || 'Not assigned');
    }
    
    db.end();
  });
}
