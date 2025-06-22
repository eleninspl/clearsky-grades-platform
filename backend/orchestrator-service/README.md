# Orchestrator Service
The Orchestrator Service acts as the main entry point to the backend system. It exposes unified RESTful APIs to clients and routes requests to the appropriate microservices (e.g., auth, credits, institution, grades, review). It also handles messaging via RabbitMQ where asynchronous communication is needed.

## Tech Stack
Node.js / Express — for the API gateway

RabbitMQ — for inter-service communication

HTTP/REST — for synchronous routing to services

Environment-based config — via .env

## Folder Structure

<pre>
orchestrator-service/
├── src/
│   ├── controllers/            # Handles route logic
│   │   ├── authController.js
│   │   ├── creditsController.js
│   │   ├── gradesController.js
│   │   ├── institutionController.js
│   │   └── reviewController.js
│   ├── rabbitmq/
│   │   ├── publishers/         # RabbitMQ message publishers
│   │   │   ├── authPublisher.js
│   │   │   └── creditsPublisher.js
│   │   └── connection.js       # Sets up RabbitMQ connection
│   ├── routes/                 # Route-level definitions
│   │   ├── authRoutes.js
│   │   ├── creditsRoutes.js
│   │   ├── gradesRoutes.js
│   │   ├── institutionRoutes.js
│   │   └── reviewRoutes.js
│   └── index.js                # Main app entry point
├── .env                        # Environment variables
├── Dockerfile                  # Container definition
├── package.json                # Project config
└── README.md                   # You are here
</pre>

## Responsibilities
Acts as API Gateway for all frontend requests

Validates and routes requests to backend microservices

Handles token forwarding and potentially central auth middleware

Publishes messages to RabbitMQ for async workflows (e.g. credits, auth events)

## Notes
All routes are prefixed and grouped by domain (/auth, /credits, /review, etc.)

JWT authentication and role-based authorization should be enforced either in this service or delegated securely to backend services

Message formats for RabbitMQ are standardized across services (see publishers/)