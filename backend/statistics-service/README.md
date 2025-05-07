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
DB_HOST=db-service
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=postgres

## Notes

- No authentication is required for read access.
- Aggregates data like average, median, and standard deviation.
- Depends on grade data created by `grades-service`.

