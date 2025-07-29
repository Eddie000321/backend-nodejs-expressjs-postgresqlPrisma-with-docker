# NodeJS SQLite Backend Project

This project is a full-stack to-do application that uses a Node.js backend, a SQLite database, and JWT for authentication.

## Description

This application allows users to register, log in, and manage their to-do lists. The backend is built with Node.js and Express, and it uses a SQLite database to store user and to-do data. Authentication is handled using JSON Web Tokens (JWT).

## Getting Started

### Dependencies

* Node.js
* npm

### Installing

1. Clone the repository:
   ```bash
   git clone https://github.com/Eddie000321/backend-nodejs-expressjs-postgresqlPrisma-with-docker.git
   ```
2. Navigate to the project directory:
   ```bash
   cd nodeJs-SQLite-backend-project
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

### Running the Server

To start the server, run the following command:

```bash
npm run dev
```

The server will start on `http://localhost:5001`.

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
