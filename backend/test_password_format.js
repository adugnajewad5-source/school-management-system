// Test the new password format with 3-digit student IDs

function generateTempPassword(name, studentId) {
  // First 4 letters of name (capitalized first letter, rest lowercase)
  const namePrefix = name.substring(0, 4).charAt(0).toUpperCase() + name.substring(1, 4).toLowerCase();
  // Get the number part of student ID (e.g., "456" from "STU-456")
  const idNumber = studentId.split('-')[1];
  return `${namePrefix}@${idNumber}`;
}

// Test cases with 3-digit IDs
const testCases = [
  { name: 'Lami', studentId: 'STU-456', expected: 'Lami@456' },
  { name: 'John', studentId: 'STU-123', expected: 'John@123' },
  { name: 'Alexander', studentId: 'STU-789', expected: 'Alex@789' },
  { name: 'Sam', studentId: 'STU-999', expected: 'Sam@999' },
  { name: 'MOHAMMED', studentId: 'STU-555', expected: 'Moha@555' }
];

console.log('Testing Password Format Generation:\n');
console.log('Format: [First4Letters]@[3DigitID]\n');
console.log('Student ID Format: STU-XXX (3 digits)\n');

testCases.forEach(test => {
  const result = generateTempPassword(test.name, test.studentId);
  const status = result === test.expected ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} Name: "${test.name}" | ID: ${test.studentId}`);
  console.log(`     Expected: ${test.expected}`);
  console.log(`     Got:      ${result}\n`);
});
