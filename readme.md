# Bytesberry Assignment

- **Frontend**: React, Zustand for state management, and React Router for routing.
- **Backend**: Node.js with Express, PostgreSQL for database management, and bcrypt for password hashing.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [License](#license)

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (v16 or higher)
- PostgreSQL

---

## Frontend Setup

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. The frontend will be available at `http://localhost:5173/`.

---

## Backend Setup

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the `backend/` directory.
   - Add the following variables:
     ```env
     POSTGRES_HOST=localhost
     POSTGRES_PORT=5432
     POSTGRES_DB=bytesberry
     POSTGRES_USER=postgres
     POSTGRES_PASSWORD=yourpassword
     PORT=3001
     ```
4. Run the backend server:
   ```bash
   npm run start
   ```
5. The backend will be available at `http://localhost:3001/`.

---

## API Endpoints

### User Routes

#### Sign Up

- **URL**: `/user/signUp`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User created successfully",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
  }
  ```

#### Sign In

- **URL**: `/user/signIn`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "User signed in successfully",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com"
    }
  }
  ```

### Todo Routes

#### Get Todos

- **URL**: `/todo/get-todos/:userId`
- **Method**: GET
- **Response**:
  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "title": "First Todo",
      "progress": 50,
      "subtodos": [
        {
          "id": 1,
          "todo_id": 1,
          "title": "Subtask 1",
          "is_completed": false
        }
      ]
    }
  ]
  ```

#### Create Todo

- **URL**: `/todo/create-todo`
- **Method**: POST
- **Request Body**:
  ```json
  {
    "userId": 1,
    "title": "New Todo",
    "subtodos": ["Subtask 1", "Subtask 2"]
  }
  ```
- **Response**:
  ```json
  {
    "todo": {
      "id": 1,
      "user_id": 1,
      "title": "New Todo",
      "progress": 0
    },
    "subtodos": [
      {
        "id": 1,
        "todo_id": 1,
        "title": "Subtask 1",
        "is_completed": false
      }
    ]
  }
  ```

---

## Project Structure

```
bytesberry/
├── frontend/               # React frontend
│   ├── src/
│   ├── public/
│   └── ...
├── backend/                # Express backend
│   ├── controllers/
│   ├── db/
│   ├── routes/
│   └── ...
├── README.md               # Documentation
└── ...
```

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
