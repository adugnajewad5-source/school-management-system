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
  addStudent();
});

function addStudent() {
  const studentData = {
    studentId: '551',
    name: 'hayu',
    class: 'Not specified',
    age: null,
    parent_phone: null,
    is_registered: false
  };

  const query = 'INSERT INTO students (studentId, name, class, age, parent_phone, is_registered) VALUES (?, ?, ?, ?, ?, ?)';
  
  db.query(query, [
    studentData.studentId,
    studentData.name,
    studentData.class,
    studentData.age,
    studentData.parent_phone,
    studentData.is_registered
  ], (err, result) => {
    if (err) {
      console.error('Error adding student:', err);
      db.end();
      process.exit(1);
    }
    console.log('Student added successfully!');
    console.log('Student ID:', studentData.studentId);
    console.log('Name:', studentData.name);
    console.log('Database ID:', result.insertId);
    db.end();
  });
}
