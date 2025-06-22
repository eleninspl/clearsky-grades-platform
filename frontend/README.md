## Frontend (Vite Site)
This folder contains the frontend application built with Vite. The app communicates with a central orchestrator service to support three distinct user roles: Representative, Student, and Instructor.

## Overview

Framework: Vite (React)

## Structure

frontend/
├── pages/
│   ├── representative/
│   ├── student/
│   └── instructor/
├── public/
├── src/
│   ├── components/
│   ├── hooks/
│   └── ...
├── index.html
├── vite.config.js
└── ...
pages/
Each subfolder under pages/ contains route-level components specific to one user role:

representative/: Dashboards, credit management, account controls

student/: Review submission, feedback, grade views

instructor/: Grade review management, response handling, queue views