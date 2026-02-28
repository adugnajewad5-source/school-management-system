# Marks System - Quick Reference Guide

## For Teachers

### Adding Marks
1. Go to "Academic Results"
2. Click "Add New Marks"
3. Enter Student ID (e.g., STU-001)
4. Wait for green checkmark
5. Select Subject
6. Enter Marks (0-100)
7. Click "Save Marks"

### Updating Marks
1. Find the mark in the table
2. Click "Edit Grade"
3. Change the marks
4. Click "Update Grade"

### Deleting Marks
1. Find the mark in the table
2. Click delete icon
3. Confirm deletion

### Exporting Results
1. Click "Export PDF"
2. Save file to computer

---

## For Students

### Viewing Your Marks
1. Go to "Academic Results"
2. View table with your marks
3. See grades and status

### Understanding Grades
- A+ (90-100): Excellent
- A (80-89): Very Good
- B+ (70-79): Good
- B (60-69): Satisfactory
- C (50-59): Acceptable
- F (0-49): Fail

### Exporting Your Results
1. Click "Export PDF"
2. Save to computer

---

## For Parents

### Viewing Child's Marks
1. Select child from dropdown
2. Go to "Results"
3. View marks and statistics

### Understanding Statistics
- **Average Marks**: Mean of all marks
- **Passed**: Number of subjects passed (≥50)
- **Failed**: Number of subjects failed (<50)
- **Overall Status**: Pass if all subjects passed

### Tracking Progress
- Check average marks trend
- Monitor pass/fail count
- Review individual subjects

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Student ID not found" | Check Student ID format (STU-XXX) |
| "Result already exists" | Use Edit button to update |
| Marks not showing | Refresh page or clear cache |
| Can't see child's marks | Verify parent-student link |
| Grade calculation wrong | Check marks are 0-100 |

---

## API Quick Reference

### Add Marks
```bash
curl -X POST http://localhost:5000/api/admin/results \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STU-001",
    "subject": "Mathematics",
    "marks": 85
  }'
```

### Get Results
```bash
curl http://localhost:5000/api/admin/results
```

### Update Marks
```bash
curl -X PUT http://localhost:5000/api/admin/results/1 \
  -H "Content-Type: application/json" \
  -d '{"marks": 92}'
```

### Get Child Results (Parent)
```bash
curl http://localhost:5000/api/parent/child/1/results \
  -H "Authorization: Bearer {token}"
```

---

## Database Quick Reference

### View All Results
```sql
SELECT * FROM results;
```

### View Results for Student
```sql
SELECT * FROM results WHERE student_id = 1;
```

### View Results by Subject
```sql
SELECT * FROM results WHERE subject = 'Mathematics';
```

### Calculate Average
```sql
SELECT student_id, AVG(marks) as average 
FROM results 
GROUP BY student_id;
```

### Find Duplicates
```sql
SELECT student_id, subject, COUNT(*) 
FROM results 
GROUP BY student_id, subject 
HAVING COUNT(*) > 1;
```

---

## Grade Calculation Formula

```javascript
function getGrade(marks) {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B+';
  if (marks >= 60) return 'B';
  if (marks >= 50) return 'C';
  return 'F';
}
```

---

## File Locations

| Component | File |
|-----------|------|
| Teacher Form | `frontend/src/components/ResultForm.jsx` |
| Teacher Page | `frontend/src/pages/ResultPage.jsx` |
| Student Page | `frontend/src/pages/ResultPage.jsx` |
| Parent Page | `frontend/src/pages/ParentResultsPage.jsx` |
| Backend API | `backend/controllers/adminController.js` |
| Parent API | `backend/controllers/parentController.js` |
| Database | `database/schema.sql` |

---

## Key Features

✓ Real-time student verification
✓ Duplicate prevention
✓ Automatic grade calculation
✓ Statistics tracking
✓ Audit trail (timestamps)
✓ Privacy enforcement
✓ PDF export
✓ Error handling

---

## Validation Rules

| Field | Rule |
|-------|------|
| Student ID | Format: STU-XXX |
| Subject | Non-empty string |
| Marks | Integer 0-100 |

---

## Response Examples

### Success Response
```json
{
  "message": "Result added successfully",
  "studentName": "John Doe",
  "studentId": "STU-001",
  "subject": "Mathematics",
  "marks": 85
}
```

### Error Response
```json
{
  "message": "Student with ID 'STU-999' not found in database"
}
```

### Results Response
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
      "marks": 85,
      "grade": "A",
      "status": "Pass"
    }
  ],
  "statistics": {
    "total_subjects": 1,
    "average_marks": 85,
    "passed": 1,
    "failed": 0,
    "overall_status": "Pass"
  }
}
```

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Add Marks | Alt + A |
| Save | Ctrl + S |
| Export PDF | Ctrl + E |
| Refresh | F5 |

---

## Performance Tips

- Refresh page after adding marks
- Clear browser cache if issues occur
- Use Chrome/Firefox for best performance
- Check internet connection
- Verify database is running

---

## Troubleshooting Flowchart

```
Issue?
├─ Marks not showing
│  └─ Refresh page → Clear cache → Check DB
├─ Student ID error
│  └─ Check format → Verify exists → Check spelling
├─ Duplicate error
│  └─ Use Edit button → Or delete first
├─ Parent can't see marks
│  └─ Check link → Verify login → Refresh
└─ Grade wrong
   └─ Check marks 0-100 → Verify calculation
```

---

## Contact & Support

For issues:
1. Check MARKS_FLOW_DOCUMENTATION.md
2. Review MARKS_SYSTEM_SETUP.md
3. Check browser console for errors
4. Verify database connection
5. Check backend logs

---

## Version Info

- **System**: School Management System
- **Module**: Marks Management
- **Version**: 1.0
- **Last Updated**: 2024
- **Status**: Production Ready

---

## Checklist Before Going Live

- [ ] Database migration applied
- [ ] Backend restarted
- [ ] Frontend tested
- [ ] All test cases passed
- [ ] No console errors
- [ ] No database errors
- [ ] Performance acceptable
- [ ] Documentation reviewed
- [ ] Team trained
- [ ] Backup created

---

## Quick Links

- [Full Documentation](MARKS_FLOW_DOCUMENTATION.md)
- [Setup Guide](MARKS_SYSTEM_SETUP.md)
- [Test Cases](MARKS_SYSTEM_TEST_CASES.md)
- [Implementation Summary](MARKS_SYSTEM_IMPLEMENTATION_SUMMARY.md)

---

## Remember

✓ Always verify student ID before adding marks
✓ Use Edit button to update, not add duplicate
✓ Check marks are between 0-100
✓ Refresh page to see updates
✓ Export PDF for records
✓ Contact support if issues persist
