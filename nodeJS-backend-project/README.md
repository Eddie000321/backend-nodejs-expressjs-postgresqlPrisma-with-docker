# NodeJS Backend Project

This project is a simple backend server built with Node.js and Express.

## Description

This server provides a basic API to manage a list of data. It also serves two simple HTML pages.

## Getting Started

### Dependencies

* Node.js
* npm

### Installing

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repository.git
   ```
2. Navigate to the project directory:
   ```bash
   cd nodeJS-backend-project
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

The server will start on `http://localhost:7777`.

## API Endpoints

The following API endpoints are available:

* `GET /`: Returns a simple HTML page with the current data.
* `GET /dashboard`: Returns a simple HTML dashboard page.
* `GET /api/data`: Returns the current data as a JSON array.
* `POST /api/data`: Adds a new entry to the data. The request body should be a JSON object with a "name" property.
* `DELETE /api/data`: Deletes the last entry from the data.

You can use the `test.rest` file to test the API endpoints.
