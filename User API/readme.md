# User API

This is a simple REST API for managing users, built with Express.js and MongoDB. It includes routes for user registration, login, profile management, and deletion. The API documentation is available via Swagger.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Routes](#routes)
  - [User Registration](#user-registration)
  - [User Login](#user-login)
  - [Get User Profile](#get-user-profile)
  - [Update User Profile](#update-user-profile)
  - [Delete User](#delete-user)
- [Running Tests](#running-tests)
- [License](#license)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo

2. Install the dependencies:
    ````bash
    npm install

3. Start the server:
    ````bash
    npm start


Usage
To use the API, you can make HTTP requests to the server. The server listens on the port specified in the .env file (default is 3000).

API Documentation
The API documentation is available at:
    -http://localhost:3000/apidocs

 ## Routes

    -User Registration
        URL: /signup
        Method: POST
        Description: Register a new user.
        Request Body:
        {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com",
            "password": "yourpassword",
            "confirmPass": "yourpassword"
        }
        Responses:
            201: User created successfully
            400: Missing fields or password mismatch
            409: Email already in use

    -User Login
        URL: /login
        Method: POST
        Description: Log in a user and get a token.
        Request Body:
        {
            "email": "john.doe@example.com",
            "password": "yourpassword"
        }
        Responses:
            200: Login successful
            400: Missing fields
            401: Unauthorized

    -Get User Profile
        URL: /getUser/{user}
        Method: GET
        Description: Get the profile of a specific user.
        Parameters:
        user (path): The email of the user.
        Authorization (header): JWT token.
        Responses:
        200: User profile retrieved successfully
        401: Unauthorized
        404: User not found
        Update User Profile
        URL: /updateUser
        Method: PUT
        Description: Update the profile of the logged-in user.
        Request Body:
        {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john.doe@example.com",
            "emailOfOther": "another.email@example.com" // Optional
        }
        Parameters:
        Authorization (header): JWT token.
        Responses:
        200: User profile updated successfully
        400: Bad request
        401: Unauthorized

    -Delete User
        URL: /deleteUser
        Method: DELETE
        Description: Delete the logged-in user.
        Request Body:
        {
          "email": "john.doe@example.com"
        }
        Parameters:
        Authorization (header): JWT token.
        Responses:
        200: User deleted successfully
        401: Unauthorized
        404: User not found

 ## Running Tests
        To run tests, use the following command:
        npm test

## Environment Variables

You need to create a `.env` file in the root directory of the project with the following variables:

- `MONGO_CONNECT`: The URL to your MongoDB instance, which could be Mongo Atlas or Compass.
- `PORT`: The port where the server will run.
- `SECRET_KEY`: The key you want to use with JWT for token generation.

You can find an example of this configuration in the file `.env.example`.
