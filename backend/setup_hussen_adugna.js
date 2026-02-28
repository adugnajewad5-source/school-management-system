const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function setupHussenAndAdugna() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('🔧 Setting up Parent Hussen and Student Adugna...\n');

    // ============================================
    // STEP 1: Create Student Adugna
    // ============================================
    console.log('📚 Step 1: Creating Student Adugna...');
    
    const studentName = 'Adugna';
    const studentClass = 'Grade 10-A';
    const studentAge = 16;
    const studentId = 'STU-100';
    
    // Check if Adugna already exists
    const [existingStudent] = await connection.execute(
      'SELECT * FROM students WHERE name = ?',
      [studentName]
    );
    
    let adugnaStudentId;
    
    if (existingStudent.length > 0) {
      adugnaStudentId = existingStudent[0].id;
      console.log(`   ✅ Student Adugna already exists (ID: ${adugnaStudentId})`);
    } else {
      // Create student record (pre-registered, not yet registered as user)
      const [studentResult] = await connection.execute(
        'INSERT INTO students (studentId, name, class, age, section, enrollment_date, is_registered) VALUES (?, ?, ?, ?, ?, CURDATE(), FALSE)',
        [studentId, studentName, studentClass, studentAge, 'A']
      );
      adugnaStudentId = studentResult.insertId;
      console.log(`   ✅ Student Adugna created (ID: ${adugnaStudentId})`);
    }

    // ============================================
    // STEP 2: Add Sample Data for Adugna
    // ============================================
    console.log('\n📊 Step 2: Adding sample data for Adugna...');
    
    // Add Results (Marks)
    const subjects = [
      { subject: 'Mathematics', marks: 50, grade: 'F' },
      { subject: 'English', marks: 85, grade: 'B+' },
      { subject: 'Science', marks: 78, grade: 'B' },
      { subject: 'History', marks: 92, grade: 'A' },
      { subject: 'Physics', marks: 65, grade: 'C' }
    ];
    
    for (const sub of subjects) {
      const [existingResult] = await connection.execute(
        'SELECT * FROM results WHERE student_id = ? AND subject = ?',
        [adugnaStudentId, sub.subject]
      );
      
      if (existingResult.length === 0) {
        await connection.execute(
          'INSERT INTO results (student_id, subject, marks) VALUES (?, ?, ?)',
          [adugnaStudentId, sub.subject, sub.marks]
        );
      }
    }
    console.log('   ✅ Added 5 subject results for Adugna');
    
    // Add Attendance Records (last 10 days)
    const attendanceRecords = [
      { date: '2026-02-17', status: 'Present' },
      { date: '2026-02-18', status: 'Present' },
      { date: '2026-02-19', status: 'Absent' },
      { date: '2026-02-20', status: 'Present' },
      { date: '2026-02-21', status: 'Present' },
      { date: '2026-02-24', status: 'Absent' },
      { date: '2026-02-25', status: 'Present' },
      { date: '2026-02-26', status: 'Present' },
      { date: '2026-02-27', status: 'Present' }
    ];
    
    for (const att of attendanceRecords) {
      const [existingAtt] = await connection.execute(
        'SELECT * FROM attendance WHERE student_id = ? AND date = ?',
        [adugnaStudentId, att.date]
      );
      
      if (existingAtt.length === 0) {
        await connection.execute(
          'INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)',
          [adugnaStudentId, att.date, att.status]
        );
      }
    }
    console.log('   ✅ Added 9 attendance records for Adugna');
    
    // Add Payment Records
    const payments = [
      { paymentDate: '2026-01-10 10:00:00', amount: 2000, paymentType: 'Tuition', status: 'Paid' },
      { paymentDate: '2026-02-10 10:00:00', amount: 2000, paymentType: 'Tuition', status: 'Pending' }
    ];
    
    for (const pay of payments) {
      const [existingPay] = await connection.execute(
        'SELECT * FROM payments WHERE studentId = ? AND paymentDate = ?',
        [adugnaStudentId, pay.paymentDate]
      );
      
      if (existingPay.length === 0) {
        await connection.execute(
          'INSERT INTO payments (studentId, amount, paymentType, status, paymentDate, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
          [adugnaStudentId, pay.amount, pay.paymentType, pay.status, pay.paymentDate]
        );
      }
    }
    console.log('   ✅ Added 2 payment records for Adugna');

    // ============================================
    // STEP 3: Create Parent Hussen
    // ============================================
    console.log('\n👨 Step 3: Creating Parent Hussen...');
    
    const parentUsername = 'hussen';
    const parentEmail = 'hussen@parent.com';
    const parentPassword = 'Hussen@123';
    
    const hashedPassword = await bcrypt.hash(parentPassword, 10);
    
    // Check if Hussen already exists
    const [existingParent] = await connection.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [parentUsername, parentEmail]
    );
    
    let hussenParentId;
    
    if (existingParent.length > 0) {
      // Update existing parent
      await connection.execute(
        'UPDATE users SET password_hash = ?, must_change_password = FALSE WHERE username = ? OR email = ?',
        [hashedPassword, parentUsername, parentEmail]
      );
      hussenParentId = existingParent[0].id;
      console.log(`   ✅ Parent Hussen updated (ID: ${hussenParentId})`);
    } else {
      // Create new parent
      const [parentResult] = await connection.execute(
        'INSERT INTO users (username, email, password_hash, role, must_change_password) VALUES (?, ?, ?, ?, ?)',
        [parentUsername, parentEmail, hashedPassword, 'parent', false]
      );
      hussenParentId = parentResult.insertId;
      console.log(`   ✅ Parent Hussen created (ID: ${hussenParentId})`);
    }

    // ============================================
    // STEP 4: Link Hussen to Adugna
    // ============================================
    console.log('\n🔗 Step 4: Linking Parent Hussen to Student Adugna...');
    
    // Check if link already exists
    const [existingLink] = await connection.execute(
      'SELECT * FROM parent_students WHERE parent_id = ? AND student_id = ?',
      [hussenParentId, adugnaStudentId]
    );
    
    if (existingLink.length === 0) {
      await connection.execute(
        'INSERT INTO parent_students (parent_id, student_id, relationship) VALUES (?, ?, ?)',
        [hussenParentId, adugnaStudentId, 'parent']
      );
      console.log('   ✅ Hussen linked to Adugna successfully!');
    } else {
      console.log('   ℹ️  Hussen already linked to Adugna');
    }

    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('✅ SETUP COMPLETE!');
    console.log('='.repeat(60));
    
    console.log('\n👨 PARENT ACCOUNT:');
    console.log('   Name: Hussen');
    console.log(`   Username: ${parentUsername}`);
    console.log(`   Email: ${parentEmail}`);
    console.log(`   Password: ${parentPassword}`);
    console.log(`   Parent ID: ${hussenParentId}`);
    
    console.log('\n👨‍🎓 STUDENT ACCOUNT:');
    console.log('   Name: Adugna');
    console.log(`   Student ID: ${studentId}`);
    console.log(`   Class: ${studentClass}`);
    console.log(`   Database ID: ${adugnaStudentId}`);
    
    console.log('\n📊 SAMPLE DATA ADDED:');
    console.log('   ✅ 5 Subject Results (Math: 50, English: 85, Science: 78, History: 92, Physics: 65)');
    console.log('   ✅ 9 Attendance Records (7 Present, 2 Absent = 78% attendance)');
    console.log('   ✅ 2 Payment Records (1 Paid: 2000 ETB, 1 Pending: 2000 ETB)');
    
    console.log('\n🔗 RELATIONSHIP:');
    console.log(`   Parent Hussen (ID: ${hussenParentId}) → Student Adugna (ID: ${adugnaStudentId})`);
    
    console.log('\n🌐 HOW TO ACCESS:');
    console.log('   1. Go to: http://localhost:5173/');
    console.log(`   2. Login with: ${parentUsername} / ${parentPassword}`);
    console.log('   3. You will see Parent Dashboard');
    console.log('   4. Click on Results/Attendance/Payments to view Adugna\'s data');
    
    console.log('\n📝 WHAT HUSSEN WILL SEE:');
    console.log('   📚 Results: Adugna got 50 in Math (Failed) - needs improvement!');
    console.log('   📅 Attendance: 78% attendance (2 absences)');
    console.log('   💰 Payments: 2000 ETB paid, 2000 ETB pending');
    
    console.log('\n' + '='.repeat(60));

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

setupHussenAndAdugna();
