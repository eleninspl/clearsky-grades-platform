# Grades Service

Handles CRUD operations for course grades (initial and final).

## Endpoints

| Method | Endpoint         | Auth | Description     |
|--------|------------------|------|-----------------|
| GET    | `/grades`        | ❌   | List all grades |
| GET    | `/grades/:id`    | ❌   | Get one grade   |
| POST   | `/grades`        | ✅   | Create grade    |
| PUT    | `/grades/:id`    | ✅   | Update grade    |
| DELETE | `/grades/:id`    | ✅   | Delete grade    |

## ENV

PORT=5004
DB_URL=postgresql://postgres:postgres@db-service:5432/clearsky
JWT_SECRET=my_jwt_secret


## Notes

- Requires valid JWT for POST/PUT/DELETE operations.
- Can be integrated with `credits-service` to consume credits upon grade creation.
- Accepts both `INITIAL` and `FINAL` grade types.
