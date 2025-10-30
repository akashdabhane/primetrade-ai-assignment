# 🚀 Live Demo & API

- **Frontend (Website):** [https://primetrade-ai-assignment-pi.vercel.app/](https://primetrade-ai-assignment-pi.vercel.app/)
- **Backend API:** [https://primetrade-ai-assignment-dk7p.onrender.com/api/v1](https://primetrade-ai-assignment-dk7p.onrender.com/api/v1)
- **Postman API Collection:** [https://www.postman.com/akashdabhane/akash-s-workspace/collection/af3ybpa/primetrade-ai-assignment?action=share&creator=23125120&active-environment=23125120-5a854fa0-99f2-4d14-bd49-ffade6a02d28](https://www.postman.com/akashdabhane/akash-s-workspace/collection/af3ybpa/primetrade-ai-assignment?action=share&creator=23125120&active-environment=23125120-5a854fa0-99f2-4d14-bd49-ffade6a02d28)

---

# Prime Trade AI Assignment

A full-stack task management application with user authentication and admin capabilities. Built with Node.js/Express backend and Next.js frontend.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Scripts](#scripts)

## ✨ Features

- **User Authentication**
  - User registration and login
  - JWT-based authentication with access and refresh tokens
  - Secure password hashing with bcrypt
  - Protected routes with middleware

- **Task Management**
  - Create, read, update, and delete tasks
  - Filter tasks by user and status
  - Task status tracking (Pending, In Progress, Completed)
  - **Live UI updates:** Creating, editing, deleting a task instantly updates the UI without requiring reload

- **Admin Features**
  - Admin user management
  - User listing and details
  - **Admin-only user and task access.**
  - View a user's tasks grouped by status (Pending, In Progress, Completed)

- **Frontend Route Protection**
  - Home and admin pages are protected using browser cookies.
  - Home (`/`) accessible only while logged in (redirects to `/login` if not).
  - Admin routes (`/admin/users` and `/admin/users/[id]`) are accessible only for admin users (redirects to `/login` if not).

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Joi** - Input validation
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

### Frontend
- **Next.js** - React framework
- **React** - UI library
- **Tailwind CSS** - Styling
- **Formik** - Form handling
- **Yup** - Schema validation
- **Axios** - HTTP client

## 📁 Project Structure

```
prime-trade-ai-assignment/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── middlewares/      # Custom middlewares
│   │   ├── database/         # Database connection
│   │   ├── utils/           # Utility functions
│   │   ├── app.js           # Express app configuration
│   │   └── index.js         # Server entry point
│   ├── package.json
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   ├── utils/           # Utility functions
│   │   └── validation-schema/ # Form validation schemas
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas connection string)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prime-trade-ai-assignment
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The server will run on `http://localhost:8000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

## 🔐 Environment Variables

Create a `.env` file **inside the `backend` directory** with the following variables:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
```

> ⚠️ Place your `.env` file inside the `backend/` folder, not the root directory.

**Important**: Never commit the `.env` file to version control. Use `.env.example` as a template.

## 📡 API Endpoints

### User Routes (`/api/v1/users`)

- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /logout` - User logout (protected)
- `POST /refresh-access-token` - Refresh access token
- `GET /` - Get logged in user info (protected)
- `GET /user/:id` - Get user by ID (protected)
- `PUT /update-info` - Update user information (protected)

### Task Routes (`/api/v1/tasks`)

- `POST /` - Create a new task (protected)
- `GET /user-tasks` - Get all tasks for the logged-in user (protected)
- `GET /:id` - Get task by ID (protected)
- `PUT /:id` - Update task by ID (protected)
- `DELETE /:id` - Delete task by ID (protected)

### Admin Routes (`/api/v1/admin`)
- `GET /users` - Get all users (admin only, protected)
- `GET /users/:userId/tasks` - Get all tasks for a user (admin only, protected, grouped by status)

## 📜 Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

Refresh tokens are sent as HTTP-only cookies for security.

## 🛡️ Frontend Route Protection

- The home page (`/`) and admin panel (`/admin/users`, `/admin/users/[id]`) are protected by client-side logic.
- Cookies `isLogin` and `isAdmin` determine user/admin access. Non-authorized access automatically redirects to `/login`.
- These protections are handled within each page's React useEffect hook for instant feedback.

## 📝 License

ISC

## 👤 Author

Prime Trade AI Assignment

---

For more details, please refer to the individual component documentation in their respective directories.

