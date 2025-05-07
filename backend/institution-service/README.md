# Institution Service

Manages educational institutions used by the system.

## Endpoints

| Method | Endpoint             | Auth | Description              |
|--------|----------------------|------|--------------------------|
| GET    | `/institutions`      | ❌   | List all institutions    |
| GET    | `/institutions/:id`  | ❌   | Get institution by ID    |
| POST   | `/institutions`      | ✅   | Create a new institution |
| PUT    | `/institutions/:id`  | ✅   | Update institution info  |
| DELETE | `/institutions/:id`  | ✅   | Delete an institution    |

## ENV

PORT=5003
DB_URL=postgresql://postgres:postgres@db-service:5432/clearsky
JWT_SECRET=my_jwt_secret

## Notes

- All write operations require authentication.
- Each institution has a `credits_balance` field used by `credits-service`.
