const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function checkParentTables() {
  try {
    console.log('=== Checking Parent-Related Tables ===\n');
    
    // Check parent_students table
    console.log('1. Checking parent_students table:');
    const [psDesc] = await pool.execute('DESCRIBE parent_students');
    console.log('✓ parent_students table exists');
    console.log(psDesc);
    console.log();
    
    // Check parent_access_logs table
    console.log('2. Checking parent_access_logs table:');
    const [palDesc] = await pool.execute('DESCRIBE parent_access_logs');
    console.log('✓ parent_access_logs table exists');
    console.log(palDesc);
    console.log();
    
    // Check users table for parent role support
    console.log('3. Checking users table structure:');
    const [usersDesc] = await pool.execute('DESCRIBE users');
    console.log('✓ users table structure:');
    console.log(usersDesc);
    console.log();
    
    // Count parent users
    console.log('4. Counting parent users:');
    const [parentCount] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = "parent"');
    console.log(`✓ Found ${parentCount[0].count} parent user(s)`);
    console.log();
    
    // Count parent-student associations
    console.log('5. Counting parent-student associations:');
    const [assocCount] = await pool.execute('SELECT COUNT(*) as count FROM parent_students');
    console.log(`✓ Found ${assocCount[0].count} parent-student association(s)`);
    console.log();
    
    console.log('=== All Parent Tables Verified ===');
    
  } catch (err) {
    console.error('Error checking tables:', err.message);
  } finally {
    await pool.end();
  }
}

checkParentTables();
