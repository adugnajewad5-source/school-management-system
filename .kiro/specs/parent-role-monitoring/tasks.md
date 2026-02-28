# Implementation Plan: Parent Role Monitoring

## Overview

This implementation plan breaks down the Parent Role Monitoring feature into discrete, actionable coding tasks. The feature adds a parent role to the existing school management system, allowing parents to view their children's academic information, attendance records, and payment status with read-only access. Implementation follows a bottom-up approach: database schema → backend API → frontend components → integration.

## Tasks

- [x] 1. Set up database schema and migrations
  - Create `parent_students` association table with foreign keys to users and students tables
  - Add `enrollment_date` and `section` columns to students table
  - Create `parent_access_logs` table for audit logging
  - Add database indexes on foreign keys for performance optimization
  - Create migration script at `database/migrations/add_parent_role_support.sql`
  - Create rollback script at `database/migrations/rollback_parent_role_support.sql`
  - _Requirements: 3.1, 3.3, 3.4, 12.3, 12.4_

- [ ]* 1.1 Write property test for parent-student association persistence
  - **Property 7: Parent-Student Association Persistence**
  - **Validates: Requirements 3.1**

- [x] 2. Implement backend authentication extensions
  - [x] 2.1 Update authController.js to support parent registration
    - Add parent registration endpoint handler
    - Generate temporary passwords for admin-created accounts
    - Set `must_change_password` flag for new parent accounts
    - Validate email uniqueness across all users
    - Implement password complexity validation (min 8 chars, uppercase, lowercase, number)
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [ ]* 2.2 Write property tests for authentication
    - **Property 1: Parent Authentication Token Structure**
    - **Property 5: Email Uniqueness Constraint**
    - **Property 6: Password Complexity Validation**
    - **Validates: Requirements 1.1, 1.3, 2.3, 2.4**
  
  - [x] 2.3 Extend JWT token generation for parent role
    - Modify token generation to include parent_id in payload
    - Set token expiration to 24 hours for parent role
    - Ensure role field is set to "parent" in token
    - _Requirements: 1.1, 1.3, 11.1_
  
  - [x] 2.4 Implement password change functionality
    - Add password change endpoint requiring current password verification
    - Validate new password complexity
    - Invalidate all existing sessions on password change
    - Force password change on first login for temporary passwords
    - _Requirements: 14.1, 14.2, 14.3, 14.4_
  
  - [ ]* 2.5 Write property tests for password management
    - **Property 4: Temporary Password Enforcement**
    - **Property 27: Password Change Session Invalidation**
    - **Property 28: Current Password Verification**
    - **Validates: Requirements 14.1, 14.3, 14.4**

- [x] 3. Implement authentication middleware and security
  - [x] 3.1 Create parentAuthMiddleware.js
    - Extract and verify JWT token from Authorization header
    - Validate token signature using JWT_SECRET
    - Check token expiration and reject expired tokens
    - Verify role is "parent"
    - Attach decoded user info to req.user
    - Return 401 for invalid/expired tokens, 403 for wrong role
    - _Requirements: 1.4, 8.3, 9.5, 17.3_
  
  - [ ]* 3.2 Write property tests for token validation
    - **Property 3: Session Expiration Enforcement**
    - **Property 13: Token Validation on Route Changes**
    - **Property 34: JWT Signature Validation**
    - **Validates: Requirements 1.4, 9.5, 17.3**
  
  - [x] 3.3 Create parentStudentMiddleware.js
    - Extract parent_id from req.user (set by parentAuthMiddleware)
    - Extract student_id from req.params
    - Query parent_students table to verify association exists
    - Return 403 if no association found
    - Log all access attempts (parent_id, student_id, timestamp, result)
    - _Requirements: 5.4, 6.4, 7.4, 8.5, 12.1, 12.2, 12.3, 12.4_
  
  - [ ]* 3.4 Write property tests for authorization
    - **Property 11: Parent-Student Authorization Verification**
    - **Property 20: Access Audit Logging**
    - **Validates: Requirements 5.4, 6.4, 7.4, 8.5, 12.1, 12.2, 12.3, 12.4**
  
  - [x] 3.5 Implement rate limiting for login endpoint
    - Track failed login attempts per parent account
    - Lock account after 5 failed attempts within 15 minutes
    - Store failed_attempts and locked_at in users table
    - Return appropriate error message when account is locked
    - _Requirements: 17.2_
  
  - [ ]* 3.6 Write property test for rate limiting
    - **Property 33: Rate Limiting Enforcement**
    - **Validates: Requirements 17.2**

- [x] 4. Checkpoint - Verify authentication and middleware
  - Ensure all tests pass, ask the user if questions arise.

- [~] 5. Implement parent controller and data access
  - [ ] 5.1 Create parentController.js with getChildren function
    - Query parent_students table for all student_ids associated with parent_id
    - Join with students table to fetch student details (name, class, section, enrollment_date)
    - Calculate summary statistics (attendance %, average grade, payment status)
    - Cache parent-student associations in session
    - Return array of children with summary data
    - _Requirements: 3.5, 4.3, 10.1, 16.2_
  
  - [ ]* 5.2 Write property tests for children retrieval
    - **Property 9: Associated Students Retrieval**
    - **Property 31: Association Caching**
    - **Validates: Requirements 3.5, 16.2**
  
  - [~] 5.3 Implement getChildProfile function
    - Fetch student details: student_id, name, class, section, enrollment_date, age, parent_phone
    - Fetch assigned teachers with contact information
    - Return complete profile data in read-only format
    - _Requirements: 13.1, 13.4_
  
  - [ ]* 5.4 Write property test for profile data completeness
    - **Property 26: Child Profile Data Completeness**
    - **Validates: Requirements 13.1, 13.4**
  
  - [~] 5.5 Implement getChildResults function
    - Query results table for all subjects associated with student_id
    - Include subject name, marks, total_marks, grade, status (Pass/Fail)
    - Calculate average grade across all subjects
    - Calculate statistics: total subjects, passed count, failed count
    - Implement pagination for more than 50 records
    - _Requirements: 5.2, 16.3_
  
  - [ ]* 5.6 Write property tests for results data
    - **Property 21: Results Data Completeness**
    - **Property 32: Results Pagination**
    - **Validates: Requirements 5.2, 16.3**
  
  - [~] 5.7 Implement getChildAttendance function
    - Query attendance table for student_id
    - Include date and status (Present/Absent) for each record
    - Calculate total_days, present_days, absent_days
    - Calculate attendance percentage: (present_days / total_days) × 100
    - Default to last 30 days, support date range parameter
    - _Requirements: 6.2, 6.5, 16.4_
  
  - [ ]* 5.8 Write property test for attendance calculation
    - **Property 22: Attendance Data Completeness**
    - **Property 23: Attendance Percentage Calculation**
    - **Validates: Requirements 6.2, 6.5**
  
  - [~] 5.9 Implement getChildPayments function
    - Query payments table for student_id
    - Include payment date, amount (ETB), status (Paid/Pending), description, receipt_number
    - Calculate total_fees, paid_fees, remaining_fees
    - Calculate remaining_fees: total_fees - paid_fees
    - Return payment history and summary
    - _Requirements: 7.2, 7.5_
  
  - [ ]* 5.10 Write property test for payment calculations
    - **Property 24: Payment Data Completeness**
    - **Property 25: Remaining Fees Calculation**
    - **Validates: Requirements 7.2, 7.5**

- [~] 6. Create parent API routes
  - [~] 6.1 Create parentRoutes.js with route definitions
    - Define GET /api/parent/children (middleware: parentAuthMiddleware)
    - Define GET /api/parent/child/:studentId/profile (middleware: parentAuthMiddleware, parentStudentMiddleware)
    - Define GET /api/parent/child/:studentId/results (middleware: parentAuthMiddleware, parentStudentMiddleware)
    - Define GET /api/parent/child/:studentId/attendance (middleware: parentAuthMiddleware, parentStudentMiddleware)
    - Define GET /api/parent/child/:studentId/payments (middleware: parentAuthMiddleware, parentStudentMiddleware)
    - Wire routes to parentController functions
    - _Requirements: 4.1, 5.1, 6.1, 7.1_
  
  - [ ]* 6.2 Write property test for route access control
    - **Property 10: Role-Based Route Access Control**
    - **Property 12: Read-Only Access Enforcement**
    - **Validates: Requirements 4.4, 8.1, 8.2, 8.3, 9.2, 9.3**
  
  - [~] 6.3 Register parent routes in backend index.js
    - Import parentRoutes
    - Mount routes at /api/parent
    - Ensure routes are registered after authentication routes
    - _Requirements: 4.1_

- [~] 7. Implement admin endpoints for parent management
  - [~] 7.1 Create admin parent management endpoints
    - Add POST /api/admin/parent endpoint to create parent accounts
    - Add POST /api/admin/parent/:parentId/link-student endpoint
    - Add DELETE /api/admin/parent/:parentId/unlink-student/:studentId endpoint
    - Require admin role for all endpoints
    - Generate temporary passwords for new parent accounts
    - _Requirements: 2.1, 3.1, 3.2_
  
  - [ ]* 7.2 Write property test for parent-student association
    - **Property 8: Multi-Child Association Support**
    - **Validates: Requirements 3.3, 3.4**

- [~] 8. Implement error handling and input sanitization
  - [~] 8.1 Create global error handler middleware
    - Handle JsonWebTokenError (401 Invalid token)
    - Handle TokenExpiredError (401 Session expired)
    - Handle database errors (500 Internal server error)
    - Handle validation errors (400 Bad request)
    - Log all errors with timestamp, user, path, method
    - Return user-friendly error messages
    - _Requirements: 15.1, 15.2, 15.3, 15.4_
  
  - [ ]* 8.2 Write property tests for error handling
    - **Property 2: Invalid Credentials Rejection**
    - **Property 29: Error Message User-Friendliness**
    - **Property 30: Server Error Handling**
    - **Validates: Requirements 1.2, 15.1, 15.2, 15.3, 15.4**
  
  - [~] 8.3 Implement input sanitization
    - Sanitize all user inputs to prevent SQL injection
    - Escape outputs to prevent XSS attacks
    - Use parameterized queries for all database operations
    - Validate and sanitize request parameters
    - _Requirements: 17.5_
  
  - [ ]* 8.4 Write property test for input sanitization
    - **Property 35: Input Sanitization**
    - **Validates: Requirements 17.5**

- [~] 9. Checkpoint - Verify backend API functionality
  - Ensure all tests pass, ask the user if questions arise.

- [~] 10. Create frontend theme system
  - [~] 10.1 Create ThemeToggle component
    - Create `frontend/src/components/ThemeToggle.jsx`
    - Implement toggle button with sun/moon icons (use lucide-react)
    - Toggle between 'bright' and 'dark' themes
    - Persist theme preference in localStorage
    - Apply CSS variables based on theme
    - _Requirements: 4.2_
  
  - [~] 10.2 Define theme CSS variables
    - Add CSS variables to `frontend/src/index.css` or create `frontend/src/styles/theme.css`
    - Bright mode: --bg-primary: #FFFFFF, --bg-secondary: #F5F5F5, --text-primary: #1A1A1A, --text-secondary: #666666, --welcome-color: #FFD700
    - Dark mode: --bg-primary: #1A1A1A, --bg-secondary: #2A2A2A, --text-primary: #FFFFFF, --text-secondary: #CCCCCC, --welcome-color: #FFD700
    - Apply theme class to document root
    - _Requirements: 4.2_

- [~] 11. Create child selector component
  - [~] 11.1 Create ChildSelector component
    - Create `frontend/src/components/ChildSelector.jsx`
    - Accept props: children array, selectedChild, onSelectChild callback
    - Render dropdown menu with child names
    - Automatically hide dropdown if only one child
    - Persist selected child_id in sessionStorage
    - Display currently selected child's name prominently
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ]* 11.2 Write property tests for child selector
    - **Property 15: Multi-Child Selector Display**
    - **Property 16: Child Selection Persistence**
    - **Property 17: Child Selection UI Update**
    - **Property 18: Selected Child Name Display**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5**

- [~] 12. Implement ParentDashboard page
  - [~] 12.1 Create ParentDashboard component
    - Create `frontend/src/pages/ParentDashboard.jsx`
    - Display welcome message with parent name in yellow color (#FFD700)
    - Include ThemeToggle component in header
    - Fetch children list from GET /api/parent/children on mount
    - Display ChildSelector if multiple children
    - Show summary cards for each child (name, class, section, attendance %, average grade, payment status)
    - Add navigation cards to: Child Profile, Results, Attendance, Payments
    - Handle loading and error states
    - _Requirements: 4.1, 4.2, 4.3, 10.1_
  
  - [ ]* 12.2 Write unit tests for ParentDashboard
    - Test component renders children list
    - Test welcome message displays parent name
    - Test theme toggle functionality
    - Test navigation cards are clickable

- [~] 13. Implement frontend API service layer
  - [~] 13.1 Create parent API service
    - Create `frontend/src/services/parentApi.js`
    - Implement getChildren() function
    - Implement getChildProfile(studentId) function
    - Implement getChildResults(studentId) function
    - Implement getChildAttendance(studentId, dateRange) function
    - Implement getChildPayments(studentId) function
    - Include JWT token in Authorization header for all requests
    - Handle 401 errors by clearing token and redirecting to login
    - Handle 403 errors by displaying access denied message
    - _Requirements: 5.1, 6.1, 7.1, 13.1_

- [~] 14. Create child profile viewer page
  - [~] 14.1 Create ParentChildProfilePage component
    - Create `frontend/src/pages/ParentChildProfilePage.jsx`
    - Fetch child profile from API using selected child_id
    - Display student ID, name, class, section, enrollment date, age, parent phone
    - Display assigned teachers with contact information
    - Render in read-only format (no edit controls)
    - Handle loading and error states
    - _Requirements: 13.1, 13.2, 13.4_
  
  - [ ]* 14.2 Write unit tests for child profile page
    - Test profile data displays correctly
    - Test read-only format (no edit buttons)
    - Test error handling for unauthorized access

- [~] 15. Create results viewer page
  - [~] 15.1 Create ParentResultsPage component
    - Create `frontend/src/pages/ParentResultsPage.jsx`
    - Fetch results from API using selected child_id
    - Display table with columns: Subject, Marks, Total Marks, Grade, Status
    - Calculate and display average grade
    - Show overall pass/fail status
    - Render in read-only format (no edit controls)
    - Handle loading and error states
    - _Requirements: 5.1, 5.2, 5.3, 5.5_
  
  - [ ]* 15.2 Write unit tests for results page
    - Test results table displays all subjects
    - Test average calculation
    - Test read-only format

- [~] 16. Create attendance viewer page
  - [~] 16.1 Create ParentAttendancePage component
    - Create `frontend/src/pages/ParentAttendancePage.jsx`
    - Fetch attendance from API using selected child_id
    - Display table with columns: Date, Status (Present/Absent)
    - Display summary: Total Days, Present Days, Absent Days, Attendance %
    - Default to last 30 days with option to select date range
    - Render in read-only format
    - Handle loading and error states
    - _Requirements: 6.1, 6.2, 6.3, 6.5_
  
  - [ ]* 16.2 Write unit tests for attendance page
    - Test attendance records display
    - Test percentage calculation display
    - Test date range selector

- [~] 17. Create payments viewer page
  - [~] 17.1 Create ParentPaymentsPage component
    - Create `frontend/src/pages/ParentPaymentsPage.jsx`
    - Fetch payments from API using selected child_id
    - Display table with columns: Date, Amount (ETB), Status, Description, Receipt Number
    - Display summary: Total Fees, Paid Fees, Remaining Fees
    - Render in read-only format
    - Handle loading and error states
    - _Requirements: 7.1, 7.2, 7.3, 7.5_
  
  - [ ]* 17.2 Write unit tests for payments page
    - Test payment history displays
    - Test remaining fees calculation display
    - Test payment status indicators

- [~] 18. Implement frontend route protection
  - [~] 18.1 Update ProtectedRoute component
    - Modify `frontend/src/components/ProtectedRoute.jsx` (or create if doesn't exist)
    - Accept allowedRoles prop
    - Extract JWT token from localStorage
    - Decode token and check expiration
    - Redirect to /login if token missing or expired
    - Check if user's role is in allowedRoles array
    - Redirect to /access-denied if role not allowed
    - Validate token on every route change
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 18.2 Write property tests for route protection
    - **Property 14: Unauthorized Route Redirect**
    - **Validates: Requirements 9.4**

- [~] 19. Register parent routes in frontend
  - [~] 19.1 Update App.jsx with parent routes
    - Add route /parent-dashboard → ParentDashboard (allowedRoles: ['parent'])
    - Add route /parent/child-profile → ParentChildProfilePage (allowedRoles: ['parent'])
    - Add route /parent/results → ParentResultsPage (allowedRoles: ['parent'])
    - Add route /parent/attendance → ParentAttendancePage (allowedRoles: ['parent'])
    - Add route /parent/payments → ParentPaymentsPage (allowedRoles: ['parent'])
    - Add route /access-denied → AccessDeniedPage
    - Wrap all parent routes with ProtectedRoute component
    - _Requirements: 9.2, 9.3_
  
  - [~] 19.2 Update login redirect logic
    - Modify login page to redirect to /parent-dashboard if role is 'parent'
    - Redirect to appropriate dashboard based on role (admin, teacher, student, parent)
    - _Requirements: 4.1_

- [~] 20. Create access denied page
  - [~] 20.1 Create AccessDeniedPage component
    - Create `frontend/src/pages/AccessDeniedPage.jsx`
    - Display user-friendly message: "You do not have permission to access this page"
    - Provide link to return to appropriate dashboard
    - _Requirements: 15.1_

- [~] 21. Checkpoint - Verify frontend functionality
  - Ensure all tests pass, ask the user if questions arise.

- [~] 22. Integration and final wiring
  - [~] 22.1 Test complete parent login flow
    - Verify parent can log in with credentials
    - Verify redirect to /parent-dashboard after login
    - Verify JWT token is stored in localStorage
    - Verify token includes parent_id and role
    - _Requirements: 1.1, 1.3, 4.1_
  
  - [~] 22.2 Test child selection and data viewing
    - Verify child selector displays for multi-child parents
    - Verify child selection persists across navigation
    - Verify all viewer pages display correct data for selected child
    - Verify parent cannot access other children's data
    - _Requirements: 10.1, 10.2, 10.3, 5.4, 6.4, 7.4_
  
  - [~] 22.3 Test theme toggle persistence
    - Verify theme toggle switches between bright and dark modes
    - Verify theme preference persists in localStorage
    - Verify theme applies correctly across all pages
    - _Requirements: 4.2_
  
  - [~] 22.4 Test error handling and edge cases
    - Verify expired token redirects to login
    - Verify unauthorized access shows error message
    - Verify parent with no children sees appropriate message
    - Verify server errors display user-friendly messages
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [~] 22.5 Test read-only access enforcement
    - Verify parent cannot access admin routes
    - Verify parent cannot access teacher routes
    - Verify parent cannot modify any data (no edit buttons visible)
    - Verify POST/PUT/DELETE requests from parent are rejected
    - _Requirements: 8.1, 8.2, 8.3, 13.3_

- [~] 23. Final checkpoint - Complete system verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional property-based tests and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties using fast-check library
- Unit tests validate specific examples and edge cases
- Implementation uses JavaScript (Node.js/Express backend, React frontend)
- All code should integrate with existing authentication and database systems
- Follow existing code style and patterns in the codebase
