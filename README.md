# NewsCenter 

NewsCenter is a web-based communication platform built around a **publish–subscribe model**.  
It enables users to view tagged announcements and news items through a clean web interface, while publishers can create and distribute messages to specific topics.

The project serves as a practical example of building a **modern full-stack web application** with a clear separation between frontend, backend, and database layers.


## What this project demonstrates 

The NewsCenter codebase focuses on the following key aspects:

- Clean separation of concerns (Frontend ↔ Backend ↔ Database)
- RESTful API design and consumption
- Modular frontend architecture using Vue.js
- Containerized database setup using Docker
- API documentation using Swagger (OpenAPI)
- Environment-based configuration (no hardcoded URLs)

The goal is to keep the system **simple and understandable**, while still reflecting real-world application structure.


## System Architecture 

NewsCenter consists of three main components:

- **Frontend**  
  Vue.js application responsible for displaying messages and tags and interacting with the backend API.

- **Backend**  
  Node.js / Express service that implements business logic, database access, and a publish–subscribe mechanism.

- **Database**  
  PostgreSQL database running in Docker for persistent storage of users, messages, and tags.

All communication from the frontend goes through the backend API.  
The frontend never communicates directly with the database.


## Technology Stack 

- Frontend: Vue.js (Vue CLI)
- Backend: Node.js + Express
- Database: PostgreSQL
- Containerization: Docker + Docker Compose
- API Documentation: Swagger (OpenAPI)


## Development Setup 

### Prerequisites
- Node.js + npm
- Docker + Docker Compose

Optional:
```bash
npm install -g @vue/cli

### Running the Application 

#### 1) Start the Database

From the project root:

docker compose up -d

Adminer (Database UI):

    URL: http://localhost:8080
    System: PostgreSQL
    Server: db
    User: newscenter
    Password: nc_secret
    Database: newscenter

#### 2) Start the Backend

cd backend
npm install
npm run dev

Backend API:

http://localhost:3000

Swagger API Documentation:

http://localhost:3000/api-docs

#### 3) Start the Frontend

cd newscenter-frontend
npm install
npm run serve

Frontend URL (port may vary):

http://localhost:8081

#### Environment Configuration 

Frontend

newscenter-frontend/.env

VUE_APP_API_URL=http://localhost:3000

Backend

backend/.env

PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=newscenter
DB_PASSWORD=nc_secret
DB_NAME=newscenter

    Note: For this university project, .env files are committed for simplicity and ease of setup.
    In production environments, sensitive configuration should never be committed.

#### API Overview 🔌

The backend exposes REST endpoints consumed by the frontend:
    GET /messages – Fetch all messages
    POST /messages – Create a new message
    GET /tags – Fetch available tags
    GET /subscribe – Server-Sent Events (live updates)
All endpoints are documented via Swagger.

#### Current Features 

    Display news messages from the database
    Display available tags/topics
    Publish new messages (publisher role)
    Modular, component-based frontend UI
    Backend API documentation via Swagger

#### Project Status 

The project currently provides a fully working end-to-end prototype:
    Frontend ↔ Backend ↔ Database communication is implemented
    Authentication and role-based access control are planned for future iterations

#### Future Improvements 

    User authentication (login)
    Role-based access control (admin vs regular users)
    Message subscriptions per user
    Enhanced UI/UX and responsiveness
    Automated tests

#### About This Project 

This project was developed as part of a university course (Innovation Lab).
Some implementation decisions prioritize clarity and ease of evaluation over production-grade security practices.