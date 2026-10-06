# Employee Visitor Management System

A full-stack MERN application for managing employee/visitor records.

## Features
- Add visitor
- View all visitors
- Update visitor details
- Delete visitor
- Search by name or mobile number
- Checked In / Checked Out status
- MongoDB persistence
- Responsive React interface

## Requirements
- Node.js 18+
- MongoDB Community Server running locally, or a MongoDB Atlas connection

## Setup

### 1. Install dependencies
From the project root:

```bash
npm install
npm run install-all
```

### 2. Configure MongoDB
Copy `server/.env.example` to `server/.env`:

```bash
cp server/.env.example server/.env
```

For local MongoDB, the default URI is:
`mongodb://127.0.0.1:27017/visitor_management`

### 3. Start the application
From the root:

```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:5000

## MERN Architecture
- MongoDB: database
- Express.js: REST API
- React.js: frontend
- Node.js: backend runtime
