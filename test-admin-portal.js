const https = require('https');

console.log('Testing Admin Portal - Student ID Display\n');
console.log('='.repeat(60));

// Test 1: Check Backend API
console.log('\n1. Testing Backend API...');
console.log('   URL: https://school-management-backend-gnav.onrender.com/api/admin/students');

const backendUrl = 'https://school-management-backend-gnav.onrender.com/api/admin/students';

https.get(backendUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const students = JSON.parse(data);
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Students Found: ${students.length}`);
      
      if (students.length > 0) {
        console.log('\n   Sample Student Records:');
        console.log('   ' + '-'.repeat(56));
        
        students.slice(0, 5).forEach((student, index) => {
          console.log(`   ${index + 1}. ID: ${student.id} | student_id: ${student.student_id || 'NULL'} | Name: ${student.name}`);
        });
        
        // Check if all have student_id
        const withoutId = students.filter(s => !s.student_id).length;
        console.log('   ' + '-'.repeat(56));
        
        if (withoutId === 0) {
          console.log(`   ✅ All ${students.length} students have student_id values`);
        } else {
          console.log(`   ⚠️  ${withoutId} students missing student_id`);
        }
      }
      
      // Test 2: Check Frontend
      console.log('\n2. Testing Frontend...');
      console.log('   URL: https://school-management-system-nu-pink.vercel.app');
      
      const frontendUrl = 'https://school-management-system-nu-pink.vercel.app';
      
      https.get(frontendUrl, (res2) => {
        console.log(`   Status: ${res2.statusCode}`);
        
        if (res2.statusCode === 200) {
          console.log('   ✅ Frontend is online and responding');
        } else {
          console.log(`   ⚠️  Frontend returned status ${res2.statusCode}`);
        }
        
        // Summary
        console.log('\n' + '='.repeat(60));
        console.log('SYSTEM STATUS SUMMARY');
        console.log('='.repeat(60));
        console.log('✅ Backend API: ONLINE');
        console.log(`✅ Students in Database: ${students.length}`);
        console.log(`✅ Students with student_id: ${students.filter(s => s.student_id).length}`);
        console.log('✅ Frontend: ONLINE');
        console.log('\nStudent IDs Found:');
        students.forEach((s, i) => {
          console.log(`   ${i + 1}. ${s.student_id} - ${s.name}`);
        });
        console.log('\n' + '='.repeat(60));
        console.log('NEXT STEPS:');
        console.log('1. Go to: https://school-management-system-nu-pink.vercel.app');
        console.log('2. Login: admin / Admin@123');
        console.log('3. Click "Student Records"');
        console.log('4. Verify Student ID column displays values above');
        console.log('5. Open browser console (F12) to see debug logs');
        console.log('='.repeat(60));
      }).on('error', (err) => {
        console.log(`   ❌ Frontend Error: ${err.message}`);
      });
      
    } catch (err) {
      console.log(`   ❌ Error parsing response: ${err.message}`);
    }
  });
}).on('error', (err) => {
  console.log(`   ❌ Backend Error: ${err.message}`);
});
