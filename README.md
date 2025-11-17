# blog-api

## Overview
A blog/articles platform with user authentication, CRUD operations, authorization, pagination, and search capabilities.

## Features
-   Authentication/Authorization
-   Pagination
-   Caching

## Getting Started

### Installation
To get this project up and running on your local machine, follow these steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/greatm3/blog-api
    ```
2.  **Navigate to the Project Directory**:
    ```bash
    cd blog-api
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4. **Create an env file, or set environment variables in process**

### Environment Variables
```env
PORT=9089
DATABASE_URL=postgresql://postgres:postgresql@localhost:5432/blog_api
FRONTEND_URL=http://localhost:9090

JWT_SIGN_KEY=21853e65bcb16553af27cae1036793002b6fbb9657baf52eaa17908f7fb39408f6df88e0ab4e42bc3e91c52dd15
```

## Usage
Once the dependencies are installed, you can interact with the project via `npm` scripts.

```bash
npm run migrate:ts # create users, and posts table, and indices in database

npm run dev # nodemon ts-node --files src/app.ts
```
- compile to JavaScript to run in production
```bash
npm run build

npm run migrate:js

npm run start # uses the port provided in the .env configuration
```

## Technologies Used
- Node.js
- Express
- Typescript
- PostgreSQL
- JWT
- Bcrypt
- Redis(not yet, still in implementation)

