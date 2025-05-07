# Course Service

Manages courses offered by institutions.

## Endpoints

| Method | Endpoint        | Auth | Description          |
|--------|-----------------|------|----------------------|
| GET    | `/courses`      | ❌   | List all courses     |
| GET    | `/courses/:id`  | ❌   | Get course by ID     |
| POST   | `/courses`      | ✅   | Create new course    |
| PUT    | `/courses/:id`  | ✅   | Update course        |
| DELETE | `/courses/:id`  | ✅   | Delete course        |

## ENV
PORT=5005
DB_URL=postgresql://postgres:postgres@db-service:5432/clearsky
JWT_SECRET=my_jwt_secret

## Notes

- Courses belong to institutions and may be used by multiple instructors.
- Required by `grades`, `review`, and `statistics` services to associate grades and data.


