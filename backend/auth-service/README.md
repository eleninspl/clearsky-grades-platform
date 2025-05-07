# Auth Service

Handles Google OAuth2 login and issues JWT tokens.

## Endpoints

| Method | Endpoint              | Auth | Description                 |
|--------|-----------------------|------|-----------------------------|
| GET    | `/auth/google`        | ❌   | Redirect to Google login    |
| GET    | `/auth/google/callback` | ❌ | Handle Google callback and issue JWT |

## ENV

PORT=5001
GOOGLE_CLIENT_ID=666438303746-mv41n4pmptnmtloi38mpvb7h5u52hpi6.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=
JWT_SECRET=my_jwt_secret


## Notes

- Uses Google OAuth2 for authentication.
- Issues signed JWT tokens for further use in protected services.
- No direct connection to the database (delegates user creation to `user-service`).

