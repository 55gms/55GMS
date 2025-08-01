# Backend Route Organization

This project has been refactored to organize API routes into separate modules for better maintainability and structure.

## File Structure

```
├── index.js                 # Main server file with Express setup and routing
├── routes/                  # API route modules
│   ├── auth.js             # Authentication routes (/api/signUp, /api/login)
│   ├── users.js            # User management routes (/api/checkPremium, /api/uploadSave, /api/readSave)
│   └── chat.js             # AI chat routes (/api/chat, /api/usedTokens)
└── utils/                   # Utility modules
    └── modelManager.js      # AI model management and token tracking
```

## Route Modules

### `routes/auth.js`

- `POST /api/signUp` - User registration with CAPTCHA verification
- `POST /api/login` - User authentication

### `routes/users.js`

- `POST /api/checkPremium` - Check user premium status
- `POST /api/uploadSave` - Upload user save data
- `POST /api/readSave` - Read user save data

### `routes/chat.js`

- `POST /api/chat` - AI chat functionality
- `GET /api/usedTokens` - Get current token usage and model info

## Utilities

### `utils/modelManager.js`

- Manages AI model rotation
- Tracks token usage
- Handles model switching logic
- Encapsulates all model-related functionality

## Main Changes

1. **Separated API routes** into logical modules based on functionality
2. **Created ModelManager utility** to handle AI model management
3. **Maintained all original functionality** while improving code organization
4. **Preserved non-Express code** like bare server setup, static file serving, and route definitions
5. **Improved maintainability** by separating concerns

## Usage

The refactored code maintains the same API endpoints and functionality as before. All routes are still accessible at the same paths, but the code is now better organized for future development and maintenance.
