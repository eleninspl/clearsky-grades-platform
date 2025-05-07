# Statistics Service

Provides statistical insights based on grade data.

## Endpoints

| Method | Endpoint                               | Auth | Description                           |
|--------|----------------------------------------|------|---------------------------------------|
| GET    | `/statistics`                          | ❌   | List all statistics                   |
| GET    | `/statistics/course/:courseId`         | ❌   | Get all statistics for a course       |
| GET    | `/statistics/:courseId/:type`          | ❌   | Get statistics by course and type     |
| GET    | `/statistics/details/:courseId/:type`  | ❌   | Get statistics with course info       |

## ENV

PORT=5007
DB_URL=postgresql://postgres:postgres@db-service:5432/clearsky?search_path=clearsky
JWT_SECRET=my_jwt_secret

## Notes

- No authentication is required for read access.
- Aggregates data like average, median, and standard deviation.
- Depends on grade data created by `grades-service`.

