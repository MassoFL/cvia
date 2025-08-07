# CVIA Authentication System

## 🔐 Overview

Complete authentication system for CVIA with JWT-based authentication, user registration, login, and session management.

## 🏗️ Architecture

### Backend (FastAPI)
- **JWT Authentication** with secure token generation
- **Password Hashing** using bcrypt
- **User Management** with Supabase PostgreSQL
- **Session Management** with optional session tracking
- **Input Validation** with Pydantic models

### Frontend (React)
- **Authentication Context** for global state management
- **Modal-based Login/Signup** with modern UI
- **User Dropdown** with profile management
- **Persistent Sessions** with localStorage
- **Real-time Validation** with visual feedback

## 📁 File Structure

```
backend/
├── auth.py                 # Core authentication logic
├── auth_endpoints.py       # FastAPI authentication routes
├── create_users_table.sql  # Database schema
└── test_auth.py           # Authentication tests

cvia/src/
├── contexts/
│   └── AuthContext.js     # React authentication context
├── components/
│   ├── AuthModal.jsx      # Login/signup modal
│   ├── AuthModal.css      # Modal styling
│   ├── UserDropdown.jsx   # User profile dropdown
│   └── UserDropdown.css   # Dropdown styling
└── FrontPage.jsx          # Updated with auth integration
```

## 🚀 Setup Instructions

### 1. Database Setup

Run the SQL schema in your Supabase dashboard:

```bash
# Execute the contents of backend/create_users_table.sql in Supabase SQL editor
```

### 2. Backend Dependencies

Install the new authentication dependencies:

```bash
cd backend
pip install PyJWT==2.8.0 bcrypt==4.1.2 email-validator==2.1.0
```

### 3. Environment Variables

Add to your environment or `backend/config.py`:

```python
JWT_SECRET_KEY = "your-super-secret-jwt-key-change-in-production"
```

### 4. Start the Backend

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 5. Test Authentication

```bash
cd backend
python test_auth.py
```

## 🔧 API Endpoints

### Authentication Routes (`/api/v1/auth/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login user |
| GET | `/me` | Get current user info |
| POST | `/logout` | Logout user |
| GET | `/health` | Health check |

### Request/Response Examples

#### Register User
```json
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "first_name": "John",
  "last_name": "Doe"
}

Response:
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 86400,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "created_at": "2025-01-31T...",
    "is_active": true
  }
}
```

#### Login User
```json
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

Response: (Same as register)
```

## 🎨 Frontend Integration

### Using Authentication Context

```jsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (isAuthenticated()) {
    return <div>Welcome, {user.first_name}!</div>;
  }
  
  return <LoginButton />;
}
```

### Authentication Modal

```jsx
import AuthModal from './components/AuthModal';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  
  return (
    <>
      <button onClick={() => setShowAuth(true)}>Login</button>
      <AuthModal 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
        initialMode="login" 
      />
    </>
  );
}
```

## 🔒 Security Features

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter  
- At least 1 number

### JWT Security
- 24-hour token expiration
- Secure secret key
- Automatic token validation
- Protected routes

### Database Security
- Password hashing with bcrypt
- SQL injection protection
- User input validation
- Secure session management

## 🧪 Testing

### Backend Tests
```bash
cd backend
python test_auth.py
```

### Manual Testing
1. Start the backend server
2. Start the React frontend
3. Click "Sign In / Sign Up" in the navbar
4. Test registration with a new email
5. Test login with existing credentials
6. Verify user dropdown appears when authenticated
7. Test logout functionality

## 🎯 Features

### ✅ Implemented
- User registration and login
- JWT token authentication
- Password validation and hashing
- User profile management
- Persistent sessions
- Modern UI with animations
- Real-time form validation
- Responsive design
- User dropdown with profile options

### 🚧 Future Enhancements
- Password reset functionality
- Email verification
- Social login (Google, LinkedIn)
- Two-factor authentication
- User profile editing
- Account settings
- Admin panel
- User roles and permissions

## 🐛 Troubleshooting

### Common Issues

1. **"User already exists" error**
   - Use a different email or try logging in instead

2. **JWT token errors**
   - Check that JWT_SECRET_KEY is set
   - Verify token hasn't expired

3. **Database connection issues**
   - Verify Supabase credentials
   - Check that users table exists

4. **CORS errors**
   - Ensure backend CORS is configured for frontend URL

### Debug Mode

Enable debug logging in `backend/auth.py`:
```python
logging.basicConfig(level=logging.DEBUG)
```

## 📝 Notes

- Tokens expire after 24 hours
- User sessions persist in localStorage
- All passwords are hashed with bcrypt
- Email validation is enforced
- The system is production-ready with proper security measures

## 🤝 Contributing

When adding new authentication features:
1. Update the database schema if needed
2. Add appropriate tests
3. Update this documentation
4. Follow the existing code patterns
5. Ensure security best practices