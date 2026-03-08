const mysql = require('mysql2/promise');
const fs = require('fs');
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

    // Read and execute schema
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

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
