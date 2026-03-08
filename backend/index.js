const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Parse database host - handle both full URL and domain-only formats
let dbHost = process.env.DB_HOST || 'localhost';
let dbPort = process.env.DB_PORT || 3306;

// If DB_HOST contains a full connection string, extract just the domain
if (dbHost.includes('://')) {
  // Extract domain from URL like: mysql://user:pass@domain:port/db
  const urlMatch = dbHost.match(/@([^:]+):(\d+)/);
  if (urlMatch) {
    dbHost = urlMatch[1];
    dbPort = urlMatch[2];
  }
}

// Database configuration with proper SSL/TLS for PlanetScale
const dbConfig = {
  host: dbHost,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management',
  port: parseInt(dbPort),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Add SSL configuration only for PlanetScale
if (dbHost && dbHost.includes('aws.connect.psdb.cloud')) {
  dbConfig.ssl = 'Amazon RDS';
}

// Use connection pool instead of single connection
const pool = mysql.createPool(dbConfig);

// Test the connection and run migrations
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ER_AUTHENTICATION_PLUGIN_ERROR') {
      console.error('Database authentication failed.');
    }
    return;
  }
  if (connection) {
    connection.release();
    console.log('Connected to MySQL database');
    
    // Run migrations on startup
    console.log('Running database migrations...');
    const { spawn } = require('child_process');
    const migration = spawn('node', ['run-railway-migration.js'], { cwd: __dirname });
    
    migration.stdout.on('data', (data) => {
      console.log(`[Migration] ${data}`);
    });
    
    migration.stderr.on('data', (data) => {
      console.error(`[Migration Error] ${data}`);
    });
    
    migration.on('close', (code) => {
      if (code === 0) {
        console.log('✓ Database migrations completed successfully');
      } else {
        console.warn('⚠ Database migrations completed with warnings');
      }
    });
  }
});

// Export pool for use in routes
const db = pool;

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const parentRoutes = require('./routes/parentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static('uploads'));

// Basic Route
app.get('/', (req, res) => {
  res.send('School Management System API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running securely on all network interfaces on port ${PORT}`);
});
