# 🔗 Social Authentication Setup Guide

## 🎯 Overview

This guide will help you set up social authentication (Google, LinkedIn, GitHub, Microsoft) for your CVIA application using Supabase Auth.

## 📋 Prerequisites

1. ✅ **Database updated** - Run the SQL schema update
2. ✅ **Backend running** - FastAPI server with social auth endpoints
3. ✅ **Frontend updated** - React components with social auth buttons

## 🔧 Step 1: Update Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Add columns for social authentication
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS social_provider VARCHAR(50),
ADD COLUMN IF NOT EXISTS social_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS social_data JSONB DEFAULT '{}';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_social_provider ON users(social_provider);
CREATE INDEX IF NOT EXISTS idx_users_social_id ON users(social_id);

-- Allow password_hash to be nullable for social users
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
```

## 🔑 Step 2: Configure OAuth Providers in Supabase

### **Google OAuth Setup**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing one
3. **Enable Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "CVIA App"
   - Authorized redirect URIs: `https://uxusqvlpusscksejqbbn.supabase.co/auth/v1/callback`
5. **Copy Client ID and Client Secret**

6. **Configure in Supabase**:
   - Go to your Supabase dashboard
   - Settings → Authentication → Providers
   - Enable Google
   - Paste Client ID and Client Secret
   - Save

### **LinkedIn OAuth Setup**

1. **Go to LinkedIn Developers**: https://www.linkedin.com/developers/
2. **Create a new app**:
   - App name: "CVIA"
   - LinkedIn Page: Your company page (or create one)
   - App logo: Upload your logo
3. **Configure OAuth 2.0**:
   - Go to "Auth" tab
   - Add redirect URL: `https://uxusqvlpusscksejqbbn.supabase.co/auth/v1/callback`
   - Request scopes: `r_liteprofile`, `r_emailaddress`
4. **Copy Client ID and Client Secret**

5. **Configure in Supabase**:
   - Settings → Authentication → Providers
   - Enable LinkedIn
   - Paste Client ID and Client Secret
   - Save

### **GitHub OAuth Setup**

1. **Go to GitHub Settings**: https://github.com/settings/developers
2. **Create OAuth App**:
   - Application name: "CVIA"
   - Homepage URL: `http://localhost:3001`
   - Authorization callback URL: `https://uxusqvlpusscksejqbbn.supabase.co/auth/v1/callback`
3. **Copy Client ID and Client Secret**

4. **Configure in Supabase**:
   - Settings → Authentication → Providers
   - Enable GitHub
   - Paste Client ID and Client Secret
   - Save

### **Microsoft OAuth Setup**

1. **Go to Azure Portal**: https://portal.azure.com/
2. **Register an application**:
   - Go to "Azure Active Directory" → "App registrations"
   - Click "New registration"
   - Name: "CVIA"
   - Redirect URI: `https://uxusqvlpusscksejqbbn.supabase.co/auth/v1/callback`
3. **Configure API permissions**:
   - Add "User.Read" permission
4. **Create client secret**:
   - Go to "Certificates & secrets"
   - Create new client secret
5. **Copy Application (client) ID and Client Secret**

6. **Configure in Supabase**:
   - Settings → Authentication → Providers
   - Enable Azure (Microsoft)
   - Paste Client ID and Client Secret
   - Save

## 🚀 Step 3: Test Social Authentication

### **Backend Test**

```bash
cd backend
python -c "
import requests
response = requests.get('http://localhost:8000/api/v1/social/auth/providers')
print('Available providers:', response.json())
"
```

### **Frontend Test**

1. **Start your servers**:
   ```bash
   # Backend
   cd backend && uvicorn main:app --reload --port 8000

   # Frontend  
   cd cvia && npm start
   ```

2. **Test the flow**:
   - Go to http://localhost:3001
   - Click "Sign In / Sign Up"
   - You should see social auth buttons below the form
   - Click any provider button to test

## 🔍 Step 4: Verify Setup

### **Check Supabase Configuration**

1. **Go to Supabase Dashboard** → **Authentication** → **Providers**
2. **Verify enabled providers**:
   - ✅ Google (enabled with Client ID/Secret)
   - ✅ LinkedIn (enabled with Client ID/Secret)  
   - ✅ GitHub (enabled with Client ID/Secret)
   - ✅ Microsoft (enabled with Client ID/Secret)

### **Test Database Integration**

```bash
cd backend
python -c "
from supabase_client import supabase
result = supabase.table('users').select('*').execute()
print('Users table structure:', result.data)
"
```

## 🎨 Frontend Integration

The social authentication is now integrated into your existing AuthModal:

- **Social buttons appear** below the email/password form
- **Consistent styling** with your existing design
- **Error handling** integrated with your modal
- **Success handling** automatically closes modal and logs user in

## 🔒 Security Features

- ✅ **OAuth 2.0 flow** handled by Supabase
- ✅ **JWT tokens** for session management
- ✅ **Secure redirects** to prevent CSRF
- ✅ **User data validation** before account creation
- ✅ **Existing user linking** by email address

## 🐛 Troubleshooting

### **Common Issues**

1. **"Provider not configured" error**:
   - Check Supabase provider settings
   - Verify Client ID/Secret are correct

2. **"Redirect URI mismatch" error**:
   - Verify redirect URI in OAuth provider settings
   - Should be: `https://uxusqvlpusscksejqbbn.supabase.co/auth/v1/callback`

3. **"Popup blocked" error**:
   - Allow popups for your domain
   - Check browser popup settings

4. **"Invalid scope" error**:
   - Check requested scopes in provider settings
   - Ensure required permissions are granted

### **Debug Mode**

Enable debug logging in `backend/social_auth.py`:

```python
logging.basicConfig(level=logging.DEBUG)
```

## 📊 User Experience Flow

1. **User clicks social provider button**
2. **Popup opens** with OAuth provider login
3. **User authenticates** with provider
4. **Popup closes** automatically
5. **User is logged in** to CVIA
6. **Modal closes** and user sees authenticated state

## 🎉 What Users Get

- **Faster registration** - no password required
- **Secure authentication** - OAuth 2.0 standard
- **Profile data** - name and email pre-filled
- **Seamless experience** - integrated with existing flow
- **Multiple options** - choose preferred provider

## 📈 Next Steps

Once social auth is working:

1. **Add more providers** (Twitter, Discord, Apple)
2. **Profile picture sync** from social providers
3. **Account linking** - connect multiple social accounts
4. **Social data enrichment** - import additional profile data
5. **Analytics** - track which providers are most popular

## 🔧 Configuration Summary

After completing this setup, users will be able to:

- ✅ **Register with Google** - one-click signup
- ✅ **Login with LinkedIn** - professional network integration  
- ✅ **Authenticate with GitHub** - developer-friendly
- ✅ **Sign in with Microsoft** - enterprise compatibility
- ✅ **Traditional email/password** - still available as fallback

The social authentication is now fully integrated with your existing CVIA authentication system!