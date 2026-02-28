# Marks System - Test Cases & Examples

## Test Scenario 1: Teacher Adds Marks for New Student

### Prerequisites:
- Teacher is logged in
- Student "STU-001" (John Doe) exists in database
- No marks exist for John Doe in Mathematics

### Steps:
1. Navigate to "Academic Results"
2. Click "Add New Marks"
3. Enter Student ID: `STU-001`
4. Wait for verification (should show green checkmark)
5. Select Subject: `Mathematics`
6. Enter Marks: `85`
7. Click "Save Marks"

### Expected Result:
```
✓ Grade added successfully for John Doe in Mathematics!
```

### Database State:
```sql
SELECT * FROM results WHERE student_id = 1 AND subject = 'Mathematics';
-- Returns: id=1, student_id=1, subject='Mathematics', marks=85, created_at=NOW()
```

### Student Portal View:
- Table shows: Mathematics | 85 | A | Pass

### Parent Portal View:
- Results list shows: Mathematics | 85 | A | Pass
- Statistics: Average=85, Passed=1, Failed=0

---

## Test Scenario 2: Teacher Tries to Add Duplicate Subject

### Prerequisites:
- Previous test completed (John Doe has Mathematics=85)
- Teacher is logged in

### Steps:
1. Navigate to "Academic Results"
2. Click "Add New Marks"
3. Enter Student ID: `STU-001`
4. Select Subject: `Mathematics` (same as before)
5. Enter Marks: `90`
6. Click "Save Marks"

### Expected Result:
```
Error: Result already exists for John Doe in Mathematics. 
Use the edit function to update marks.
```

### Database State:
```sql
SELECT * FROM results WHERE student_id = 1 AND subject = 'Mathematics';
-- Still returns: marks=85 (unchanged)
```

---

## Test Scenario 3: Teacher Updates Existing Marks

### Prerequisites:
- John Doe has Mathematics=85
- Teacher is logged in

### Steps:
1. Navigate to "Academic Results"
2. Find the Mathematics row for John Doe
3. Click "Edit Grade" button
4. Form appears with current data
5. Change Marks from `85` to `92`
6. Click "Update Grade"

### Expected Result:
```
✓ Grade updated successfully!
```

### Database State:
```sql
SELECT * FROM results WHERE student_id = 1 AND subject = 'Mathematics';
-- Returns: marks=92, updated_at=NOW()
```

### Student Portal View:
- Table shows: Mathematics | 92 | A+ | Pass

---

## Test Scenario 4: Student Views Their Own Marks

### Prerequisites:
- John Doe (STU-001) has marks in database
- Student is logged in as John Doe

### Steps:
1. Navigate to "Academic Results"
2. View results table

### Expected Result:
Table displays:
| Subject | Marks | Grade | Status |
|---------|-------|-------|--------|
| Mathematics | 92 | A+ | Pass |
| Physics | 78 | B+ | Pass |
| Chemistry | 85 | A | Pass |

### Filtering Logic:
```javascript
// Only shows results where student_id matches logged-in student
displayResults = results.filter(r => r.student_id === user.id)
```

---

## Test Scenario 5: Parent Views Child's Results

### Prerequisites:
- Parent is logged in
- Parent has child "John Doe" (STU-001) linked
- John Doe has marks in database

### Steps:
1. Navigate to Parent Dashboard
2. Select child "John Doe" from dropdown
3. Click "Results" tab
4. View results and statistics

### Expected Result:
```json
{
  "success": true,
  "student": {
    "id": 1,
    "student_id": "STU-001",
    "name": "John Doe",
    "class": "Grade 10"
  },
  "results": [
    {
      "id": 1,
      "subject": "Mathematics",
      "marks": 92,
      "grade": "A+",
      "status": "Pass",
      "added_date": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "subject": "Physics",
      "marks": 78,
      "grade": "B+",
      "status": "Pass",
      "added_date": "2024-01-16T11:00:00Z"
    },
    {
      "id": 3,
      "subject": "Chemistry",
      "marks": 85,
      "grade": "A",
      "status": "Pass",
      "added_date": "2024-01-17T09:30:00Z"
    }
  ],
  "statistics": {
    "total_subjects": 3,
    "average_marks": 85,
    "passed": 3,
    "failed": 0,
    "overall_status": "Pass"
  }
}
```

---

## Test Scenario 6: Invalid Student ID

### Prerequisites:
- Teacher is logged in

### Steps:
1. Navigate to "Academic Results"
2. Click "Add New Marks"
3. Enter Student ID: `STU-999` (non-existent)
4. Wait for verification

### Expected Result:
```
✗ Student ID not found in database
```

### Form State:
- Student Name field remains empty
- "Save Marks" button is disabled
- Error message in red

---

## Test Scenario 7: Invalid Marks Range

### Prerequisites:
- Teacher is logged in
- Valid student ID entered

### Steps:
1. Navigate to "Academic Results"
2. Click "Add New Marks"
3. Enter Student ID: `STU-001`
4. Select Subject: `Mathematics`
5. Enter Marks: `150` (invalid - exceeds 100)
6. Click "Save Marks"

### Expected Result:
```
Error: Please enter valid marks between 0 and 100.
```

### Form State:
- Form is not submitted
- Error message displayed
- Marks field highlighted

---

## Test Scenario 8: Multiple Students with Same Subject

### Prerequisites:
- Teacher is logged in
- Multiple students exist

### Steps:
1. Add Mathematics marks for STU-001: 85
2. Add Mathematics marks for STU-002: 92
3. Add Mathematics marks for STU-003: 78

### Expected Result:
All three records created successfully

### Database State:
```sql
SELECT * FROM results WHERE subject = 'Mathematics';
-- Returns 3 rows with different student_ids
```

### Teacher View:
All three results visible in table

### Each Student's View:
Only their own Mathematics mark visible

---

## Test Scenario 9: Grade Calculation Verification

### Test Data:
| Marks | Expected Grade |
|-------|-----------------|
| 95 | A+ |
| 85 | A |
| 75 | B+ |
| 65 | B |
| 55 | C |
| 45 | F |

### Steps:
1. Add marks for each range
2. Verify grade calculation in student portal

### Expected Result:
All grades calculated correctly according to scale

---

## Test Scenario 10: Export to PDF

### Prerequisites:
- Student has marks in database
- Student is logged in

### Steps:
1. Navigate to "Academic Results"
2. Click "Export PDF" button
3. Save file

### Expected Result:
PDF file generated with:
- Student name
- All marks
- Grades
- Formatted table

---

## Test Scenario 11: Pagination (Large Dataset)

### Prerequisites:
- Student has 100+ marks in database

### Steps:
1. Navigate to "Academic Results"
2. View first page (50 results)
3. Click "Next Page"
4. View second page

### Expected Result:
- First page shows results 1-50
- Second page shows results 51-100
- Pagination controls work correctly

---

## Test Scenario 12: Real-time Verification

### Prerequisites:
- Teacher is logged in
- Student ID field is empty

### Steps:
1. Type Student ID slowly: `S`
2. Wait 500ms
3. Type: `T`
4. Wait 500ms
5. Type: `U`
6. Wait 500ms
7. Type: `-`
8. Wait 500ms
9. Type: `0`
10. Type: `0`
11. Type: `1`

### Expected Result:
- After typing complete ID, verification runs
- Green checkmark appears
- Student name auto-fills
- Save button becomes enabled

---

## Test Scenario 13: Concurrent Submissions

### Prerequisites:
- Two teachers logged in
- Same student exists

### Steps:
1. Teacher 1: Add Mathematics = 85
2. Teacher 2: Add Physics = 90
3. Both submit simultaneously

### Expected Result:
Both records created successfully
- Mathematics: 85
- Physics: 90

### Database State:
```sql
SELECT * FROM results WHERE student_id = 1;
-- Returns 2 rows
```

---

## Test Scenario 14: Delete and Re-add

### Prerequisites:
- Student has Mathematics = 85

### Steps:
1. Delete Mathematics record
2. Add Mathematics = 92

### Expected Result:
- First record deleted
- New record created with new marks
- No duplicate constraint violation

---

## Test Scenario 15: Statistics Calculation

### Prerequisites:
- Student has marks:
  - Mathematics: 90 (Pass)
  - Physics: 85 (Pass)
  - Chemistry: 45 (Fail)

### Steps:
1. Parent views child's results
2. Check statistics

### Expected Result:
```json
{
  "total_subjects": 3,
  "average_marks": 73.33,
  "passed": 2,
  "failed": 1,
  "overall_status": "Fail"
}
```

---

## Automated Test Script (Optional)

```javascript
// Test marks system
async function testMarksSystem() {
  const baseURL = 'http://localhost:5000/api';
  
  // Test 1: Add marks
  const addResult = await fetch(`${baseURL}/admin/results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: 'STU-001',
      subject: 'Mathematics',
      marks: 85
    })
  });
  console.log('Add Result:', await addResult.json());
  
  // Test 2: Get results
  const getResult = await fetch(`${baseURL}/admin/results`);
  console.log('Get Results:', await getResult.json());
  
  // Test 3: Update marks
  const updateResult = await fetch(`${baseURL}/admin/results/1`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ marks: 92 })
  });
  console.log('Update Result:', await updateResult.json());
}

testMarksSystem();
```

---

## Performance Benchmarks

| Operation | Expected Time |
|-----------|----------------|
| Add marks | < 500ms |
| Verify student ID | < 300ms |
| Get all results | < 1s |
| Get child results | < 500ms |
| Update marks | < 500ms |
| Delete marks | < 300ms |

---

## Error Scenarios

### Scenario A: Database Connection Lost
**Expected:** Error message "Server error"
**Recovery:** Automatic retry on next action

### Scenario B: Invalid JWT Token
**Expected:** Redirect to login
**Recovery:** Re-login required

### Scenario C: Network Timeout
**Expected:** Error message "Request failed"
**Recovery:** Manual retry

### Scenario D: Concurrent Duplicate Submission
**Expected:** Second submission rejected
**Recovery:** User sees error message

---

## Validation Rules

| Field | Rule | Example |
|-------|------|---------|
| Student ID | Format STU-XXX | STU-001 ✓, STU001 ✗ |
| Subject | Non-empty | Mathematics ✓, "" ✗ |
| Marks | 0-100 integer | 85 ✓, 150 ✗, 85.5 ✗ |

---

## Success Criteria

- [x] All test scenarios pass
- [x] No database errors
- [x] No console errors
- [x] Response times acceptable
- [x] Data integrity maintained
- [x] Privacy rules enforced
- [x] Grade calculations correct
- [x] Statistics accurate
