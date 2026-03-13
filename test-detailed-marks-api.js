const https = require('https');

// Test the detailed marks API
const testData = {
  studentId: "STU-357",
  subject: "Science",
  midExamMarks: 25,
  assignmentMarks: 18,
  finalExamMarks: 42
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'school-management-backend-gnav.onrender.com',
  port: 443,
  path: '/api/admin/results',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🧪 Testing detailed marks API...');
console.log('📤 Sending data:', testData);

const req = https.request(options, (res) => {
  console.log(`📊 Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📥 Response Body:', data);
    
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('✅ SUCCESS: Detailed marks API is working!');
    } else {
      console.log('❌ ERROR: API returned error status');
      try {
        const errorData = JSON.parse(data);
        console.log('🔍 Error details:', errorData);
      } catch (e) {
        console.log('🔍 Raw error response:', data);
      }
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request error:', e.message);
});

req.write(postData);
req.end();