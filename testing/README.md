## Testing Folder
This folder contains Postman-style .json collections used for testing various backend services in the application. Each file represents a set of structured API test cases, typically used during development and integration testing.

## Contents
auth_testing.json: Covers login/logout flows for different user roles (rep, admin, student), user creation scenarios, and permission-related failures.

credits_testing.json: Tests institutional credit operations such as balance checks, credit purchases, and access restrictions for different roles.

institution_testing.json: Exercises full institution management functionality — listing, creating, editing, credit patching, and deletion.

review_testing.json: Validates the student review request process, instructor responses, and role-based access control for review-related endpoints.