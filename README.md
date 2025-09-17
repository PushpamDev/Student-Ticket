# Student Ticket Fullstack

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

A full-stack application for managing student tickets, built with a modern tech stack. This application allows students to create and track tickets, while admins and superadmins can manage them efficiently.

## ✨ Features

-   **Role-Based Access Control:** Different views and permissions for students, admins, and superadmins.
-   **Ticket Management:** Create, view, update, and track the status of tickets.
-   **Real-time Messaging:** Communicate with admins through messages on each ticket.
-   **Feedback System:** Students can provide feedback and ratings on resolved tickets.
-   **Admin Dashboard:** Admins can view and manage tickets for their respective branches.
-   **Superadmin Dashboard:** Superadmins have a global view of all tickets and admin performance.

## 🛠️ Tech Stack

-   **Frontend:** React, TypeScript, Vite, TailwindCSS, React Router
-   **Backend:** Node.js, Express, Mongoose, JWT
-   **Database:** MongoDB
-   **Development Tools:** `pnpm`, `vitest`, `prettier`

## 📂 Project Structure

```
/
├── client/                 # Frontend React application
│   ├── src/                # Main source code
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components for each route
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and API helpers
│   │   └── state/          # Global state management (e.g., Zustand, Redux)
│   ├── public/             # Static assets (images, fonts)
│   └── index.html          # Entry point for the React app
│
├── server/                 # Backend Express server
│   ├── src/                # Main source code
│   │   ├── routes/         # API route handlers
│   │   ├── models/         # Database models (e.g., Mongoose, Prisma)
│   │   └── middleware/     # Custom Express middleware (e.g., auth)
│   ├── db.ts               # Database connection setup
│   └── index.ts            # Entry point for the Express server
│
├── shared/                 # Code shared between client and server (e.g., types)
│
└── netlify/                # Netlify-specific configuration
    └── functions/          # Serverless functions for deployment
```


## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or higher)
- `pnpm` package manager
- MongoDB instance (local or cloud)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Student-ticket-Fullstack
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following variables:
    ```
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    SUPERADMIN_EMAIL=<your_superadmin_email>
    FARIDABAD_ADMIN_EMAILS=<comma_separated_emails>
    PUNE_ADMIN_EMAILS=<comma_separated_emails>
    FARIDABAD_PLACEMENT_EMAILS=<comma_separated_emails>
    PUNE_PLACEMENT_EMAILS=<comma_separated_emails>
    ```

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    The application will be available at `http://localhost:5173`.

## Available Scripts

- `pnpm dev`: Starts the development server for both the client and server.
- `pnpm build`: Builds the client and server for production.
- `pnpm start`: Starts the production server.
- `pnpm test`: Runs tests using `vitest`.
- `pnpm format.fix`: Formats the code using `prettier`.
- `pnpm typecheck`: Runs TypeScript type checking.

## API Endpoints

### Authentication (`/api/auth`)

- **`POST /register`**: Registers a new user.
  - **Request Body:** `{ "name": "string", "email": "string", "password": "string", "branch": "string" (optional for students) }`
  - **Response:** `{ "token": "string", "user": { ... } }`

- **`POST /login`**: Logs in an existing user.
  - **Request Body:** `{ "email": "string", "password": "string" }`
  - **Response:** `{ "token": "string", "user": { ... } }`

- **`GET /me`**: Retrieves the currently authenticated user.
  - **Authentication:** Bearer Token
  - **Response:** `{ "user": { ... } }`

### Tickets (`/api/tickets`)

- **`POST /`**: Creates a new ticket.
  - **Authentication:** Bearer Token
  - **Request Body:** `{ "branch": "string", "studentName": "string", ... }`
  - **Response:** `{ "ticket": { ... } }`

- **`GET /`**: Retrieves a list of tickets based on the user's role.
  - **Authentication:** Bearer Token
  - **Response:** `{ "tickets": [ ... ] }`

- **`GET /:id`**: Retrieves a single ticket by its ID.
  - **Authentication:** Bearer Token
  - **Response:** `{ "ticket": { ... } }`

- **`PUT /:id`**: Updates a ticket's status or adds feedback.
  - **Authentication:** Bearer Token
  - **Request Body:** `{ "status": "string" }` or `{ "feedback": { ... } }`
  - **Response:** `{ "ticket": { ... } }`

### Messages (`/api/messages`)

- **`GET /:ticketId`**: Retrieves all messages for a specific ticket.
  - **Authentication:** Bearer Token
  - **Response:** `{ "messages": [ ... ] }`

- **`POST /:ticketId`**: Adds a new message to a ticket.
  - **Authentication:** Bearer Token
  - **Request Body:** `{ "body": "string" }`
  - **Response:** `{ "message": { ... } }`

### Superadmin (`/api/superadmin`)

- **`GET /tickets`**: Retrieves all tickets for the superadmin.
  - **Authentication:** Bearer Token (Superadmin role required)
  - **Response:** `{ "tickets": [ ... ] }`

- **`GET /ratings`**: Retrieves average ratings for each admin.
  - **Authentication:** Bearer Token (Superadmin role required)
  - **Response:** `{ "ratings": [ ... ] }`

- **`GET /ratings/:adminId/tickets`**: Retrieves all tickets for a specific admin.
  - **Authentication:** Bearer Token (Superadmin role required)
  - **Response:** `{ "tickets": [ ... ] }`

## Deployment

This application is configured for deployment on Netlify. The `netlify.toml` file contains the necessary build and redirect settings. To deploy, connect your Git repository to a new Netlify site.

The server is set up to be deployed as a serverless function.

I have updated the `README.md` file with the new documentation. Please review it and let me know if you would like any changes.