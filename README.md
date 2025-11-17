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

## API Endpoints

All API requests should be prefixed with `/api/`.

### Authentication

| HTTP Method | Endpoint | Description | Authentication Required | Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Creates a new user account. | No | `email`, `password` |
| `POST` | `/auth/login` | Authenticates a user and returns a JWT. | No | `email`, `password` |
| `GET` | `/auth/profile` | Authenticates a user and returns profile info | yes | No |

### Posts Management

Requests that require authentication must include the **JWT** in the `Authorization` header as a Bearer token.

| HTTP Method | Endpoint | Description | Authentication Required | Access | Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/posts` | Creates a new blog post. | Yes | Author | `title`, `content`, `status` |
| **GET** | `/posts` | **Retrieves a paginated list of all published posts.** | No | Public | Query Params: `page`, `limit`, `search` |
| `GET` | `/posts/:slug` | Retrieves a single post by slug. | No | Public | N/A |
| `PATCH` | `/posts/:slug` | **Updates an existing post by slug.** | Yes | Author (Owner) | `title`, `content`, `status` all fields are optional |
| `DELETE` | `/posts/:slug` | Deletes a post by slug. | Yes | Author (Owner) | N/A |

### auth

- register `http://localhost:9089/api/auth/register` - POST

```sh

curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.test", "password":"Skijkhah99@#"}'
```

- login `http://localhost:3000/api/auth/login` - POST
```sh

curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.test", "password":"Skijkhah99@#"}'
```

- profile `http://localhost:3000/api/auth/profile` - GET
```sh

curl -X GET http://localhost:3000/api/auth/profile \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzYxNjc0MjUwLCJleHAiOjE3NjE3NjA2NTB9.nstHLlvxLbREIjheQrd7F635JEd4ztHQG7Rl936dtts"
```

### posts
- Create post
```sh
# Ensure 'YOUR_JWT_TOKEN' is replaced with the token from the login step.
curl -X POST http://localhost:9089/api/posts \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \ 
    -H "Content-Type: application/json" \
    -d '{
        "title":"How I Learned JavaScript the Hard Way", 
        "content":"When I first started learning JavaScript, I constantly made mistakes that forced me to understand how the language really works. I would forget semicolons, confuse '==' with '===', and mix up var, let, and const. Over time, I finally grasped the core concepts.", 
        "status":"published"
    }'

# Expected 201 Response: Post object including the auto-generated 'slug' and 'excerpt'.

```

- Get post 
```sh
curl -X GET 'http://localhost:9089/api/posts/how-i-learned-javascript-the-hard-way' 
# Expected 200 Response: post object
``` 

- Get posts(not implemented yet).
    Query Parameters: - `page` - Integer, default 1 - `limit` - Integer, default
    10, max 50 - `author` - Email or user ID (filter by author) -
    `search` - Search in title and content - `sort` - "newest", "oldest", "popular" (by
    view_count > 50)

```sh
curl -X GET 'http://localhost:9089/api/posts?page=2&limit=5&search=javascript'
# Expected 200 Response: A JSON object with 'data' child, -> data.posts = (an array), data.pagination = (obj, pagination metadata).
```

- Update post
```sh
curl -X PATCH 'http://localhost:9089/api/posts/how-i-learned-javascript-the-hard-way' \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \ 
    -H "Content-Type: application/json" \
    -d '{
        "title": "My Updated JS Learning Experience", 
        "status": "draft"
    }'
# Expected 200 Response: Updated post object. (Note: Title change regenerates slug).
```

- Delete post(not implemented yet)
```sh
curl -X DELETE 'http://localhost:9089/api/posts/how-i-learned-javascript-the-hard-way' \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Expected 204 Response: Empty response body
```

TODOS

- [ ] /api/posts get endpoint
- [ ] /api/posts delete endpoint
- [ ] Use Redis for caching
- [ ] image uploads