# Dockerized NodeJS, PostgreSQL, and Prisma Project

This project is a full-stack to-do application that is containerized using Docker. It uses a Node.js backend, a PostgreSQL database, the Prisma ORM, and JWT for authentication.

## Description

This application allows users to register, log in, and manage their to-do lists. The backend is built with Node.js and Express, and it uses a PostgreSQL database with the Prisma ORM to store user and to-do data. Authentication is handled using JSON Web Tokens (JWT). The entire application is containerized using Docker for easy deployment and scalability.

## Getting Started

### Prerequisites

* Docker
* Docker Compose

### Running the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/Eddie000321/backend-nodejs-expressjs-postgresqlPrisma-with-docker.git
   ```
2. Navigate to the project directory:
   ```bash
   cd startWithDocker
   ```
3. Create a `.env` file in the root of the project and add the following environment variables:
   ```
   DATABASE_URL="postgresql://user:password@db:5432/db_name"
   JWT_SECRET="your_jwt_secret"
   ```
4. Build and run the application using Docker Compose:
   ```bash
   docker-compose up -d
   ```

The application will be available at `http://localhost:5001`.

## API Endpoints

The following API endpoints are available:

### Authentication

* `POST /auth/register`: Registers a new user.
* `POST /auth/login`: Logs in a user and returns a JWT.

### To-Dos

* `GET /todos`: Fetches all to-dos for the authenticated user.
* `POST /todos`: Creates a new to-do for the authenticated user.
* `PUT /todos/:id`: Updates a to-do for the authenticated user.
* `DELETE /todos/:id`: Deletes a to-do for the authenticated user.

You can use the `todo-app.rest` file to test the API endpoints.

## Database Schema

The database schema is defined in the `prisma/schema.prisma` file. It consists of two models: `User` and `Todo`.

### User Model

* `id`: The unique identifier for the user.
* `username`: The user's username.
* `password`: The user's hashed password.

### Todo Model

* `id`: The unique identifier for the to-do.
* `task`: The description of the to-do.
* `completed`: A boolean indicating whether the to-do is completed.
* `userId`: The ID of the user who owns the to-do.
