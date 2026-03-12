// Test script to check current system status
const https = require('https');

const testUrls = [
  'https://school-management-system-nu-pink.vercel.app/',
  'https://school-management-system-nu-pink.vercel.app/login',
  'https://school-management-system-nu-pink.vercel.app/results',
  'https://school-management-system-nu-pink.vercel.app/students',
  'https://school-management-system-nu-pink.vercel.app/admin'
];

console.log('🧪 Testing Current System Status...\n');

async function testUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      console.log(`${url}`);
      console.log(`Status: ${res.statusCode} ${res.statusMessage}`);
      console.log(`Content-Type: ${res.headers['content-type']}`);
      console.log('---');
      resolve({ url, status: res.statusCode, contentType: res.headers['content-type'] });
    });
    
    req.on('error', (err) => {
      console.log(`${url}`);
      console.log(`Error: ${err.message}`);
      console.log('---');
      resolve({ url, error: err.message });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      console.log(`${url}`);
      console.log('Error: Timeout');
      console.log('---');
      resolve({ url, error: 'Timeout' });
    });
  });
}

async function runTests() {
  const results = [];
  
  for (const url of testUrls) {
    const result = await testUrl(url);
    results.push(result);
  }
  
  console.log('\n📊 SUMMARY:');
  results.forEach(result => {
    if (result.error) {
      console.log(`❌ ${result.url} - ERROR: ${result.error}`);
    } else if (result.status === 200) {
      console.log(`✅ ${result.url} - OK (${result.status})`);
    } else {
      console.log(`⚠️ ${result.url} - ${result.status}`);
    }
  });
  
  const hasErrors = results.some(r => r.error || (r.status && r.status !== 200));
  
  if (hasErrors) {
    console.log('\n🔧 DIAGNOSIS: SPA routing is not working properly');
    console.log('The fixes I created need to be deployed to resolve this issue.');
  } else {
    console.log('\n✅ DIAGNOSIS: System is working correctly');
  }
}

runTests().catch(console.error);