# Review Service

Handles grade review requests and instructor responses.

## Endpoints

| Method | Endpoint               | Auth | Description                    |
|--------|------------------------|------|--------------------------------|
| GET    | `/review-requests`     | ❌   | List all review requests       |
| GET    | `/review-requests/:id` | ❌   | Get request by ID              |
| POST   | `/review-requests`     | ✅   | Submit new review request      |
| POST   | `/review-responses`    | ✅   | Submit instructor's response   |

## ENV

PORT=5006
DB_URL=postgresql://postgres:postgres@db-service:5432/clearsky
JWT_SECRET=my_jwt_secret

## Notes

- A student submits a review request for a specific grade.
- An instructor can respond with a justification or grade change.
- Works in coordination with `grades-service`.

