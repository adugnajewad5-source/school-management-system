const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function checkPayments() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  console.log('Checking payments table structure:');
  try {
    const [columns] = await connection.execute('DESCRIBE payments');
    console.log(columns);
  } catch (err) {
    console.log('Payments table does not exist or error:', err.message);
  }

  await connection.end();
  process.exit(0);
}

checkPayments().catch(console.error);
