
# Organization Management App

https://organization-managnment-app.onrender.com/

An application for managing users and organizations, providing functionality for user registration, login, and associating users with organizations.

## Features

- User registration with automatic creation of a default organization.
- User login with JWT authentication.
- CRUD operations for organizations.
- Associating users with organizations.

## Technology Stack

- Node.js
- Express
- Sequelize
- PostgreSQL
- jsonwebtoken
- Joi

## Setup and Installation

### Prerequisites

- Node.js (v14.x or higher)
- npm (v6.x or higher)
- PostgreSQL

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/organization-management-app.git
   cd organization-management-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `.env` file in the root directory and add the following variables:

   ```env
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_HOST=your_db_host
   DB_PORT=5432
   DB_NAME=organization_management_db
   JWT_SECRET=your_jwt_secret
   PORT=3000
   ```

4. Initialize the database:

   Ensure your PostgreSQL server is running and the credentials match those in your `.env` file. Then, run the following command to synchronize the database:

   ```bash
   npx sequelize-cli db:migrate
   ```

5. Start the server:

   ```bash
   npm start
   ```

## Usage

### User Registration

- **URL**: `POST /api/auth/register`
- **Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "yourpassword",
    "phone": "1234567890"
  }
  ```

### User Login

- **URL**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }
  ```

### Create an Organization

- **URL**: `POST /api/organisations`
- **Headers**: `Authorization: Bearer <your_jwt_token>`
- **Body**:
  ```json
  {
    "name": "My New Organization",
    "description": "Description of the organization"
  }
  ```

### Get All Organizations

- **URL**: `GET /api/organisations`
- **Headers**: `Authorization: Bearer <your_jwt_token>`

### Get a Single Organization

- **URL**: `GET /api/organisations/:orgId`
- **Headers**: `Authorization: Bearer <your_jwt_token>`

### Add a User to an Organization

- **URL**: `POST /api/organisations/:orgId/users`
- **Headers**: `Authorization: Bearer <your_jwt_token>`
- **Body**:
  ```json
  {
    "userId": "user-id-to-add"
  }
  ```

