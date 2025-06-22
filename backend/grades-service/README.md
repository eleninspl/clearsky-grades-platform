# Grades Service

The Grades Service is a microservice responsible for managing grade records, grade uploads, and generating grade-related analytics such as distributions and question-level performance. It supports both  workflows and student access to personal results.

## Overview
Tech stack: Node.js, Express, PostgreSQL
Purpose: Manage grades, support bulk upload, and expose analysis endpoints
Access control: Handled via authorize.js middleware using JWT and user roles

## Folder Structure

grades-service/
├── init/
│   ├── 01-schema.sql          # SQL table definitions for grades
│   └── 02-seed.sql            # Sample/test data
├── src/
│   ├── controllers/
│   │   └── gradeController.js       # Core logic for all endpoints
│   ├── middleware/
│   │   └── authorize.js             # Role-based access control
│   ├── routes/
│   │   └── gradeRoutes.js           # Defines HTTP endpoints
│   ├── db.js                        # PostgreSQL connection
│   ├── rabbitmq.js                  # For async messaging if needed
│   └── index.js                     # Entry point
├── .env                             # Environment variables
├── Dockerfile                       # Container definition
├── package.json                     # Dependencies and scripts
└── README.md                        # You are here

## Authentication & Roles
All protected endpoints require a JWT in the Authorization header. Role enforcement is defined in authorize.js.

: Full access to grade creation, update, deletion, uploads, and statistics

STUDENT: Can access only their own grades

ADMIN: Read access to all grades and statistics

## API Endpoints

GET	/grade	Get all grades	

GET	/grade/:id	Get a grade by ID	

POST	/grade	Create a new grade	

PUT	/grade/:id	Update a grade	

DELETE	/grade/:id	Delete a grade	

GET	/student/:id	Get grades of a specific student

GET	/:id/courses	Get ’s course list	

POST	/:type	Upload grades file (e.g., exam, quiz)	

GET	/distribution/:courseId/:type	Get total grade distribution (public)	

GET	/distribution/:courseId/:type/q/:question	Get distribution for a specific question	

GET	/questions/:courseId/:type	Get list of question keys for a grade type