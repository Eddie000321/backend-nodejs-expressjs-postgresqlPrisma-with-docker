# Backend NodeJS Projects

This repository contains three backend projects built with Node.js and Express. Each project demonstrates a different level of complexity and features.

## Projects

### 1. NodeJS Backend Project

A simple backend server that provides a basic API to manage a list of data. It also serves two simple HTML pages.

**Features:**

* Basic API with GET, POST, and DELETE endpoints.
* Serves simple HTML pages.

**To run this project:**

1. Navigate to the `nodeJS-backend-project` directory.
2. Install the dependencies: `npm install`
3. Start the server: `npm run dev`

The server will be available at `http://localhost:7777`.

### 2. NodeJS SQLite Backend Project

A full-stack to-do application that uses a Node.js backend, a SQLite database, and JWT for authentication.

**Features:**

* User registration and login with JWT authentication.
* CRUD operations for to-dos.
* SQLite database for data storage.

**To run this project:**

1. Navigate to the `nodeJs-SQLite-backend-project` directory.
2. Install the dependencies: `npm install`
3. Start the server: `npm run dev`

The server will be available at `http://localhost:5001`.

### 3. Dockerized NodeJS, PostgreSQL, and Prisma Project

A full-stack to-do application that is containerized using Docker. It uses a Node.js backend, a PostgreSQL database, the Prisma ORM, and JWT for authentication.

**Features:**

* User registration and login with JWT authentication.
* CRUD operations for to-dos.
* PostgreSQL database with Prisma ORM.
* Containerized with Docker for easy deployment.

**To run this project:**

1. Navigate to the `startWithDocker` directory.
2. Create a `.env` file with the required environment variables.
3. Build and run the application with Docker Compose: `docker-compose up -d`

The application will be available at `http://localhost:5001`.
