const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Railway credentials
const dbConfig = {
  host: 'centerbeam.proxy.rlwy.net',
  user: 'root',
  password: 'oGGYFZAYYVfJyMReLooWEFXCiWETNGep',
  database: 'railway',
  port: 58962,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function createTables() {
  let connection;
  try {
    console.log('Connecting to Railway database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✓ Connected to Railway database');

    // Read the schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`\nExecuting ${statements.length} SQL statements...\n`);

    for (const statement of statements) {
      try {
        console.log(`Executing: ${statement.substring(0, 60)}...`);
        await connection.execute(statement);
        console.log('✓ Success\n');
      } catch (err) {
        console.error(`✗ Error: ${err.message}\n`);
      }
    }

    console.log('✓ All tables created successfully!');
    console.log('\nNow creating admin user...');

    // Create admin user
    const adminQuery = `
      INSERT INTO users (username, email, password_hash, role, must_change_password)
      VALUES ('admin', 'admin@school.com', '$2b$10$YourHashedPasswordHere', 'admin', FALSE)
      ON DUPLICATE KEY UPDATE id=id;
    `;

    await connection.execute(adminQuery);
    console.log('✓ Admin user created/verified');

    console.log('\n✓ Database setup complete!');
    console.log('You can now login with:');
    console.log('  Username: admin');
    console.log('  Password: Admin@123');

  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

createTables();
