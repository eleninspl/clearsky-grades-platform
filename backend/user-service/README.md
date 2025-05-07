# User Service

Handles creation and retrieval of user data after authentication.

## Endpoints

| Method | Endpoint | Auth | Description             |
|--------|----------|------|-------------------------|
| GET    | `/me`    | ✅   | Get or create user info |

## ENV

PORT=5002
DB_URL=postgresql://postgres:postgres@db-service:5432/clearsky
JWT_SECRET=my_jwt_secret

## Notes

- Requires JWT from `auth-service` to identify the user.
- Checks for existing user by Google account (`sub`) and creates one if not found.
- Assigns user to an institution and role (e.g. STUDENT or INSTRUCTOR).
