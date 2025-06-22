# Institution Service

The Institution Service is a standalone microservice responsible for managing institution-related operations such as creation, listing, updates, credit adjustments, and deletion. It enforces role-based access control to ensure only representatives and authorized users can perform relevant actions.

## Overview
Tech stack: Node.js, Express, PostgreSQL
Purpose: Handle the lifecycle and credit management of institutions in the system
Access control: Secured via middleware (authorize.js) based on JWT tokens

## Folder Structure

<pre>
institution-service/
├── init/
│   ├── 01-schema.sql          # SQL schema for institutions
│   └── 02-seed.sql            # Optional seed data for testing
├── src/
│   ├── controllers/
│   │   └── institutionController.js   # Core logic for handling requests
│   ├── middleware/
│   │   └── authorize.js               # JWT-based role checking
│   ├── routes/
│   │   └── institutionRoutes.js       # API endpoint definitions
│   ├── db.js                          # PostgreSQL DB connection
│   └── index.js                       # App entry point
├── .env                               # Environment configuration
├── Dockerfile                         # Docker build instructions
├── package.json                       # Dependencies and scripts
└── README.md                          # You are here
</pre>

## Authentication & Roles
JWT is expected in the Authorization header.

Middleware in authorize.js checks the user's role:


## API Endpoints
Defined in institutionRoutes.js and implemented in institutionController.js. Key routes:

GET	/stats	Get institution statistics	

GET	/stats/course-list	Get course list with instructors	


