# No Duplicate Marks System

## Overview
The system prevents duplicate course entries for students. When a teacher adds marks for a subject that already exists, the system automatically updates the existing grade instead of creating a new entry.

## How It Works

### Scenario 1: First Time Adding Marks
1. Teacher adds marks for student 551 in "Mathematics" (85/100)
2. System checks if Mathematics already exists for this student
3. **Result**: New entry created
4. Student sees: Mathematics - 85/100

### Scenario 2: Updating Existing Marks
1. Teacher adds marks for student 551 in "Mathematics" (90/100)
2. System checks if Mathematics already exists for this student
3. **Result**: Existing entry updated (85 → 90)
4. Student sees: Mathematics - 90/100 (only one entry, not two)

## Database Implementation

### Unique Constraint
The `results` table has a unique constraint on `(student_id, subject)`:

```sql
UNIQUE KEY unique_student_subject (student_id, subject)
```

This ensures only one entry per student per subject.

### Update Logic
When adding marks:
1. Check if result exists for `student_id` + `subject`
2. If exists: UPDATE the marks
3. If not exists: INSERT new result

## API Behavior

### Request
```
POST /api/admin/results
{
  "studentId": "551",
  "subject": "Mathematics",
  "marks": 90
}
```

### Response - First Time (Create)
```json
{
  "message": "Result added successfully and notification sent to student",
  "studentName": "hayu",
  "studentId": "551",
  "subject": "Mathematics",
  "marks": 90,
  "action": "created"
}
```

### Response - Update
```json
{
  "message": "Result updated successfully and notification sent to student",
  "studentName": "hayu",
  "studentId": "551",
  "subject": "Mathematics",
  "marks": 90,
  "previousMarks": 85,
  "action": "updated"
}
```

## Frontend Behavior

### Teacher Experience
1. Teacher adds marks for student 551 in Mathematics (85)
2. System shows: "✓ Grade added successfully for hayu in Mathematics!"
3. Teacher adds marks for student 551 in Mathematics (90)
4. System shows: "✓ Grade updated for hayu in Mathematics! Previous: 85, New: 90"

### Student Experience
1. Student sees Mathematics - 85/100 on Results page
2. Teacher updates to 90
3. Student sees Mathematics - 90/100 (same entry, updated grade)
4. No duplicate entries appear

## Notifications

### On Create
- Title: "New Marks: Mathematics"
- Message: "Your marks for Mathematics have been published: 85/100 (Grade: A)"

### On Update
- Title: "Marks Updated: Mathematics"
- Message: "Your marks for Mathematics have been updated: 90/100 (Grade: A)"

## Testing

### Test Case 1: Add New Marks
1. Log in as teacher
2. Go to Results page
3. Add marks for student 551, subject "Physics", marks 75
4. **Expected**: "Grade added successfully"
5. Log in as student 551
6. Go to Results page
7. **Expected**: Physics - 75/100 appears once

### Test Case 2: Update Existing Marks
1. Log in as teacher
2. Go to Results page
3. Add marks for student 551, subject "Physics", marks 85
4. **Expected**: "Grade updated for hayu in Physics! Previous: 75, New: 85"
5. Log in as student 551
6. Go to Results page
7. **Expected**: Physics - 85/100 (still only one entry)

### Test Case 3: Multiple Subjects
1. Add marks for student 551:
   - Mathematics: 90
   - Physics: 85
   - Chemistry: 80
2. Log in as student 551
3. Go to Results page
4. **Expected**: Three separate entries, no duplicates

## Database Query Examples

### Check if subject exists for student
```sql
SELECT id, marks FROM results 
WHERE student_id = 17 AND subject = 'Mathematics';
```

### Get all unique subjects for student
```sql
SELECT DISTINCT subject, marks FROM results 
WHERE student_id = 17 
ORDER BY subject;
```

### Count results per student
```sql
SELECT student_id, COUNT(DISTINCT subject) as subject_count 
FROM results 
GROUP BY student_id;
```

## Benefits

1. **No Clutter**: Students don't see duplicate course entries
2. **Clean Data**: Database stays organized with one entry per subject
3. **Easy Updates**: Teachers can easily update grades
4. **Clear History**: Notifications show when grades are updated
5. **Accurate Reporting**: Reports show correct data without duplicates

## Error Handling

### Invalid Input
- Missing studentId, subject, or marks: Returns 400 error
- Marks outside 0-100 range: Returns 400 error
- Student not found: Returns 404 error

### Success Cases
- New marks added: Returns 201 with "created" action
- Existing marks updated: Returns 200 with "updated" action

## Future Enhancements

- Grade history tracking (show previous grades)
- Bulk update functionality
- Import marks from CSV (with duplicate handling)
- Audit log for grade changes
- Grade change notifications to parents
