# AuthServer

AuthServer is a simple authentication server built with Node.js, Express.js, and MongoDB. It provides endpoints for user authentication, token generation, token refreshing, and token invalidation.

## Features

- User creation
- User login
- Token generation
- Token refreshing
- Token invalidation/logout

## Requirements

- Node.js
- Express.js
- jsonwebtoken
- dotenv
- mongoose

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>

2. **Navigate to the project directory:**

    ```bash
    cd AuthServer

3. **Configure environment variables:**

    ```bash
    node scripts/generateSecrets.js

4. **Set up connection to MongoDB:**

    Create a mongo collaction and add the connection string to the .env file under the name "URI"

5. **Running in "dev" mode:**
 
    ```bash
    npm run dev

6. **Build the project:**

    ```bash
    npm run build

7. **Start the server:**

    ```bash
    npm run start

## Usage
   
  ### Endpoints:
  
    POST /create: Create a new user.
    POST /login: Authenticate user and generate tokens.
    POST /token: Refresh access token using refresh token.
    DELETE /logout: Invalidate refresh token.
  
  ### Authentication Middleware:
  
You can protect routes by using the provided authentication middleware. Example usage:

    
```javascript
const { authenticationMiddleware } = require('./middleware');

app.get('/', authenticationMiddleware, (req, res) => {
    // Handle protected route logic
    res.json(posts.filter(post => post.username === req.user.name));
});
        
   ```

## License

This project is licensed under the MIT License.
