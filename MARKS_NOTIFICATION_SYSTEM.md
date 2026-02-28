# Marks Notification System

## Overview
When a teacher adds marks for a student, the system automatically sends a notification to that student. Students can view their marks notifications in real-time through the notification panel.

## How It Works

### 1. Teacher Adds Marks
- Teacher navigates to the Results/Marks page
- Clicks "Add New Marks"
- Enters student ID, subject, and marks
- Submits the form

### 2. Automatic Notification Creation
When marks are added:
- The marks are saved to the `results` table
- A notification is automatically created in the `notifications` table
- The notification includes:
  - Student ID (who should receive it)
  - Notification type: "marks"
  - Title: "New Marks: [Subject]"
  - Message: "Your marks for [Subject] have been published: [Marks]/100 (Grade: [Grade])"
  - Data: JSON with subject, marks, and grade

### 3. Student Receives Notification
- Student logs in to their portal
- A bell icon appears in the header with unread count
- Notifications are fetched automatically every 30 seconds
- Student can click the bell to view all notifications
- Clicking a notification marks it as read

## Database Schema

### Notifications Table
```sql
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);
```

## API Endpoints

### Get Student Notifications
```
GET /api/notifications/student/:studentId
```
Returns all notifications for a student, ordered by most recent first.

### Mark Notification as Read
```
PUT /api/notifications/:id/read
```
Marks a specific notification as read.

### Get Unread Count
```
GET /api/notifications/student/:studentId/unread-count
```
Returns the count of unread notifications for a student.

## Frontend Components

### NotificationsPanel Component
Located at: `frontend/src/components/NotificationsPanel.jsx`

Features:
- Bell icon with unread count badge
- Dropdown panel showing all notifications
- Auto-refresh every 30 seconds
- Click to mark as read
- Shows notification type with appropriate icon
- Displays date and time

### Integration
The NotificationsPanel is integrated into StudentDashboard and displays in the header next to theme toggle buttons.

## Grade Calculation
Grades are automatically calculated based on marks:
- 90-100: A+
- 80-89: A
- 70-79: B+
- 60-69: B
- 50-59: C
- Below 50: F

## Example Flow

1. Teacher adds marks for student ID "551" (hayu) in Math: 85 marks
2. System creates notification:
   - Title: "New Marks: Math"
   - Message: "Your marks for Math have been published: 85/100 (Grade: A)"
3. Student sees bell icon with "1" unread notification
4. Student clicks bell to view notification
5. Notification shows with green checkmark icon
6. Student clicks notification to mark as read
7. Unread count decreases

## Testing

To test the system:
1. Log in as a teacher
2. Go to Results page
3. Add marks for a student (e.g., student ID "551")
4. Log in as that student
5. Check the bell icon in the header
6. Click to view the notification

## Future Enhancements

Possible improvements:
- Email notifications when marks are published
- SMS notifications
- Notification preferences (which types to receive)
- Bulk mark upload with notifications
- Parent notifications when student marks are published
- Notification history/archive
