const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function checkDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  console.log('Checking teachers table structure:');
  const [columns] = await connection.execute('DESCRIBE teachers');
  console.log(columns);

  console.log('\nChecking students table structure:');
  const [studentColumns] = await connection.execute('DESCRIBE students');
  console.log(studentColumns);

  console.log('\nChecking payments table structure:');
  const [paymentColumns] = await connection.execute('DESCRIBE payments');
  console.log(paymentColumns);

  await connection.end();
}

checkDatabase().catch(console.error);
