# Employee Shift Management System

This project is an Employee Shift Management System built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. The system allows an admin to view employee availability, create shifts, and assign them to employees based on their availability and time zones.

## Table of Contents
- [Installation](#installation)
- [Backend Setup](#backend-setup)
  - [Environment Variables](#environment-variables)
  - [Running the Backend](#running-the-backend)
- [Frontend Setup](#frontend-setup)
  - [Running the Frontend](#running-the-frontend)

## Installation

To get the project up and running, follow the steps below.

### Backend Setup

1. Clone the repository to your local machine:
    ```bash
    git clone <repository-url>
    ```
   
2. Navigate to the backend directory:
    ```bash
    cd backend
    ```

3. Install the required dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file in the root of the backend directory and add the following environment variables:

    ```env
    MONGO_URI=<your-mongodb-connection-string>
    JWT_SECRET=<your-jwt-secret-token>
    ```

    - `MONGO_URI`: This should be your MongoDB connection string.
    - `JWT_SECRET`: A secret key for JSON Web Token (JWT) authentication.

### Running the Backend

To start the backend server in development mode, run the following command:

```bash
npm run dev
```
The server will start, and you should see output indicating that the server is running and connected to the database.

### Frontend Setup

  1. Navigate to the frontend directory:

```bash
cd frontend
```
  2. Install the required dependencies:
```
bash
npm install
```
###Running the Frontend
To start the frontend development server, run the following command:

```bash
npm start
```
This will launch the React application in your default browser at http://localhost:3000.
