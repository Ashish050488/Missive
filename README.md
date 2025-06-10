# Missive Chat Application

This is a real-time chat application with a Node.js backend and a React frontend.

## Prerequisites

- Node.js (v18.x or later recommended)
- MongoDB
- Redis

## Setup

1.  **Clone the repository.**
2.  **Backend Setup:**
    - Navigate to the root directory.
    - Create a `.env` file by copying `.env.example`.
    - Fill in the required values in your `.env` file for `MONGO_DB_URI`, `JWT_SECRET`, and `REDIS_URL`.
    - Install dependencies: `npm install`
3.  **Frontend Setup:**
    - Navigate to the `frontend` directory: `cd frontend`
    - Install dependencies: `npm install`
    - Go back to the root directory: `cd ..`

## Running the Application

- **Build frontend and start backend (from root directory):**
  ```bash
  npm run build
  ```
- This will build the frontend assets and then start the backend server.
- The backend server (including Socket.IO) will be running on the port specified in your `.env` file (default 5000).
- The frontend can be accessed via the static serve from the backend, typically `http://localhost:PORT`.

## Key Technologies

- Backend: Node.js, Express, MongoDB, Mongoose, Socket.IO, Redis
- Frontend: React, Vite
