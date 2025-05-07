# Upload Service

Handles uploading of Excel files containing grade data and forwards them to the grades service.

## Endpoints

| Method | Endpoint   | Auth | Description                |
|--------|------------|------|----------------------------|
| POST   | `/upload`  | ✅   | Upload `.xlsx` grade file  |

## Expected Excel Format

| user_id | course_id | value | type     | grade_batch_id |
|---------|-----------|-------|----------|----------------|
|   ...   |    ...    |  ...  | INITIAL  |      ...       |

## ENV

PORT=5009
JWT_SECRET=my_jwt_secret

## Notes

- Accepts `.xlsx` files via `multipart/form-data` using the `file` field.
- Parses and validates each row, then sends to `grades-service`.
- Fails silently per row and returns partial success if applicable.
