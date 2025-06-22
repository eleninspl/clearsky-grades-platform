# Credits Service

The Credits Service is a standalone microservice responsible for managing institutional credit balances. It supports operations such as querying current balance, purchasing credits, and viewing transaction history. Only institution representatives and administrators are allowed to perform these actions.

## Overview
Tech stack: Node.js, Express, PostgreSQL
Purpose: Manage credit purchases, balances, and history per institution
Access control: Enforced via authorize.js using JWT tokens

## Folder Structure

<pre>
credits-service/
├── init/
│   ├── 01-schema.sql            # SQL schema for credit-related tables
│   └── 02-seed.sql              # Optional seed/test data
├── src/
│   ├── controllers/
│   │   └── creditsController.js       # Core logic for each route
│   ├── middleware/
│   │   └── authorize.js               # JWT role-based access control
│   ├── routes/
│   │   └── creditsRoutes.js           # API route definitions
│   ├── db.js                          # PostgreSQL connection setup
│   └── index.js                       # Service entry point
├── .env                               # Environment variables
├── Dockerfile                         # Docker container definition
├── package.json                       # Project config and dependencies
└── README.md                          # You're here
</pre>


## Authentication & Roles
JWT tokens are required in the Authorization header. Access is restricted to:

ADMIN

INST_REP (Institution Representative)

Other roles are denied access to these endpoints.

## API Endpoints

GET	/:institutionId/balance	Get credit balance for an institution	

POST	/:institutionId/buy	Purchase additional credits	

GET	/:institutionId/history	View credit transaction history	