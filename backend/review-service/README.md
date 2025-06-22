# Review Service

## Review Service
The Review Service is a standalone microservice responsible for managing grade review requests in the system. It supports functionality for students to submit review requests and instructors to respond, with proper role-based access control.

## Overview
Tech stack: Node.js, Express, PostgreSQL

Purpose: Handle the lifecycle of review requests and responses

Access control: Secured via middleware (authorize.js) based on JWT tokens

## Folder Structure

<pre>
review-service/
├── init/
│   ├── 01-schema.sql        # SQL schema for tables used by the service
│   └── 02-seed.sql          # Sample or test data
├── src/
│   ├── controllers/
│   │   └── reviewController.js    # Business logic for reviews
│   ├── middleware/
│   │   └── authorize.js           # JWT-based role authorization
│   ├── routes/
│   │   └── reviewRoutes.js        # Defines API endpoints
│   ├── db.js                      # PostgreSQL connection setup
│   └── index.js                   # Entry point for the service
├── .env                     # Environment-specific variables
├── Dockerfile               # Container config
├── package.json             # Project config and dependencies
└── README.md                # You are here
</pre>

## Authentication & Roles
JWT is expected in the Authorization header.

Middleware (authorize.js) checks roles:

Students can create and view their own requests.

Instructors can view and respond to assigned requests.

Representatives may have elevated read-only access (if configured).

## API Endpoints
These are defined in reviewRoutes.js and handled by reviewController.js. Common routes include:

POST /review/requests – create a new request (student)

GET /review/requests/student/:studentId – get requests for a student

GET /review/instructor – instructor’s pending review queue

POST /review/responses – instructor submits response



