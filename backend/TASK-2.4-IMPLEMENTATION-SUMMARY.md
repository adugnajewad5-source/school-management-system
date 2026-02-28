# Task 2.4: Password Change Functionality Implementation

## Overview
Implemented complete password change functionality for the parent role monitoring feature, meeting all requirements 14.1-14.4.

## Requirements Implemented

### ✅ Requirement 14.1: Current Password Verification
- The password change endpoint requires the current password for verification
- Rejects requests without current password
- Validates that the provided current password matches the stored hash
- **Exception**: Skips current password check for users with `must_change_password=true` (first login)

### ✅ Requirement 14.2: Password Complexity Validation
- Enforces minimum 8 characters
- Requires at least one uppercase letter
- Requires at least one lowercase letter
- Requires at least one number
- Requires at least one special character (@#$!)
- Prevents password from being the same as username

### ✅ Requirement 14.3: Session Invalidation on Password Change
- Added `password_changed_at` column to users table
- JWT tokens now include `password_changed_at` timestamp
- Authentication middleware verifies token timestamp against current user's `password_changed_at`
- All tokens issued before password change are automatically invalidated
- Users must re-login after password change

### ✅ Requirement 14.4: Force Password Change on First Login
- Admin-created accounts have `must_change_password=true`
- Login response includes `mustChange` flag
- Password change allowed without current password for first login
- `must_change_password` flag cleared after successful password change

## Files Modified

### 1. `database/migrations/add_password_changed_at.sql` (NEW)
- Adds `password_changed_at` column to users table
- Sets default value to CURRENT_TIMESTAMP
- Updates existing users with current timestamp

### 2. `backend/controllers/authController.js`
**Changes in `login` function:**
- Added `password_changed_at` to JWT token payload
- Token now includes timestamp for session invalidation

**Changes in `changePassword` function:**
- Updates `password_changed_at` to CURRENT_TIMESTAMP on password change
- Returns `requiresRelogin: true` flag in response
- Clears `must_change_password` flag after successful change

### 3. `backend/middleware/authMiddleware.js`
**Major refactor:**
- Changed from synchronous to async function
- Added database connection pool
- Queries user's current `password_changed_at` on each request
- Compares token's timestamp with user's current timestamp
- Invalidates tokens if password was changed after token issuance
- Returns specific error message for invalidated sessions

### 4. `backend/routes/authRoutes.js`
- Added `/change-password` POST endpoint
- Protected with `authMiddleware`
- Imports `changePassword` controller function

## Database Schema Changes

```sql
ALTER TABLE users 
ADD COLUMN password_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
```

## API Endpoint

### POST `/api/auth/change-password`
**Authentication**: Required (JWT token)

**Request Body:**
```json
{
  "currentPassword": "OldPassword@123",  // Optional for first login
  "newPassword": "NewPassword@456"
}
```

**Success Response (200):**
```json
{
  "message": "Password updated successfully. Please log in again with your new password.",
  "requiresRelogin": true
}
```

**Error Responses:**
- `400`: Current password required/incorrect, or weak new password
- `401`: Invalid/expired token
- `404`: User not found
- `500`: Server error

## Testing

### Test Files Created:
1. `backend/test-password-change.js` - Unit test for session invalidation logic
2. `backend/test-password-change-integration.js` - Integration tests for all requirements
3. `backend/run-migration.js` - Migration runner script

### Test Results:
All tests passed successfully:
- ✅ Current password verification works correctly
- ✅ Password complexity validation enforced
- ✅ Old tokens invalidated after password change
- ✅ First login password change works without current password

## Security Considerations

1. **Stateless Token Invalidation**: Uses timestamp-based approach instead of token blacklist
2. **Database Query on Each Request**: Minimal performance impact, ensures real-time validation
3. **Password Hashing**: Uses bcrypt with cost factor 10
4. **No Password in Logs**: Passwords never logged or exposed

## Migration Instructions

1. Run the migration:
   ```bash
   node backend/run-migration.js
   ```

2. Restart the backend server to pick up code changes

3. Existing users will have `password_changed_at` set to current timestamp

4. All existing JWT tokens remain valid until they expire naturally

## Frontend Integration Notes

The frontend should:
1. Check `mustChange` flag in login response
2. Redirect to password change page if `mustChange === 1`
3. Handle `requiresRelogin: true` in password change response
4. Clear stored token and redirect to login after password change
5. Handle 401 errors with "invalidated" message by clearing token and redirecting to login

## Backward Compatibility

- Existing users without `password_changed_at` will have it set during migration
- Existing JWT tokens without `password_changed_at` will continue to work (null check in middleware)
- No breaking changes to existing authentication flow
