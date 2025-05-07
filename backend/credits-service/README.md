# Credits Service

Manages credit balances for institutions.

## Endpoints

| Method | Endpoint               | Auth | Description                      |
|--------|------------------------|------|----------------------------------|
| GET    | `/credits/:id`         | ❌   | View current credit balance      |
| POST   | `/credits/:id/buy`     | ✅   | Purchase additional credits      |
| POST   | `/credits/:id/use`     | ✅   | Consume one credit (e.g. per grade upload) |

## ENV

PORT=5008
DB_URL=postgresql://postgres:postgres@db-service:5432/clearsky
JWT_SECRET=my_jwt_secret

## Notes

- Used by `grades-service` to deduct credits per grade batch.
- Institutions must have enough balance to post final grades.
- Only authenticated users can buy or consume credits.
