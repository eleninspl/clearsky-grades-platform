# Auth Service

The Auth Service is a standalone authentication and user provisioning microservice. It handles user login, signup, Google OAuth integration, and role-based account creation. It is responsible for issuing and verifying JWTs used throughout the system.

## Overview
Tech stack: Node.js, Express, PostgreSQL, Passport.js
Purpose: User authentication, token issuance, and user provisioning
Access control: Enforced via authorize.js middleware using JWT and roles

## Folder Structure

auth-service/
├── init/
│   ├── 01-schema.sql            # SQL schema for users
│   └── 02-seed.sql              # Seed data for development
├── src/
│   ├── controllers/
│   │   └── authController.js         # Core logic for auth routes
│   ├── middleware/
│   │   └── authorize.js              # JWT role authorization
│   ├── routes/
│   │   └── authRoutes.js             # REST routes for auth
│   ├── utils/
│   │   └── verify.js                 # Token and data verification logic
│   ├── db.js                         # Database connection setup
│   ├── passport.js                   # Passport strategies (Google)
│   └── index.js                      # Entry point
├── hash.js                           # Password hashing utility
├── .env                              # Environment variables
├── Dockerfile                        # Docker container definition
├── package.json                      # Dependencies and scripts
└── README.md                         # You are here

## Authentication & Roles
JWT tokens are issued on login or OAuth success and must be passed in the Authorization header. Role checking is enforced on protected routes.

## API Endpoints
Defined in authRoutes.js and implemented in authController.js.

Method	Endpoint	

POST	/signup	Register a user via local email/password	

POST	/login	Login and receive a JWT	

POST	/logout	Logout (JWT invalidation is client-side)	

POST	/verify-google	Initiate Google OAuth login	

POST	/verify-google-token	Verify Google ID token (client-side flow)	

GET	/google	Start Google OAuth (server-side flow)	

GET	/google/callback	Handle Google OAuth redirect and token issuance	

GET	/users/:id	Get user info by ID	 (token logic may apply)

POST	/users	Create a user with a specific role	