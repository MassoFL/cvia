#!/usr/bin/env python3
"""
Social authentication integration for CVIA using Supabase Auth
"""

from fastapi import APIRouter, HTTPException, Request, status
from fastapi.responses import JSONResponse, RedirectResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import logging
from supabase_client import supabase
from auth import create_access_token, user_to_response, UserResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

class SocialAuthCallback(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    provider: str
    user_data: Dict[str, Any]

class SocialAuthResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    user: UserResponse
    provider: str
    is_new_user: bool

@router.get("/auth/{provider}")
async def initiate_social_auth(provider: str):
    """
    Initiate social authentication with the specified provider
    """
    try:
        # Supported providers
        supported_providers = ['google', 'linkedin', 'github', 'facebook', 'twitter', 'microsoft']
        
        if provider.lower() not in supported_providers:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Provider '{provider}' not supported. Supported providers: {supported_providers}"
            )
        
        # Get the OAuth URL from Supabase
        auth_response = supabase.auth.sign_in_with_oauth({
            "provider": provider.lower(),
            "options": {
                "redirect_to": f"http://localhost:3001/auth/callback/{provider}"
            }
        })
        
        if not auth_response.url:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to generate OAuth URL for {provider}"
            )
        
        logger.info(f"OAuth URL generated for {provider}: {auth_response.url}")
        
        return JSONResponse(content={
            "provider": provider,
            "auth_url": auth_response.url,
            "message": f"Redirect to {provider} for authentication"
        })
        
    except Exception as e:
        logger.error(f"Error initiating {provider} auth: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to initiate {provider} authentication"
        )

@router.get("/auth/callback/{provider}")
async def handle_social_auth_callback(provider: str, request: Request):
    """
    Handle OAuth callback from social providers
    """
    try:
        # Get query parameters
        query_params = dict(request.query_params)
        
        logger.info(f"Received {provider} callback with params: {list(query_params.keys())}")
        
        # Handle OAuth callback with Supabase
        if 'code' in query_params:
            # Exchange code for session
            auth_response = supabase.auth.exchange_code_for_session({
                "auth_code": query_params['code']
            })
            
            if not auth_response.user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to authenticate with social provider"
                )
            
            user_data = auth_response.user
            session_data = auth_response.session
            
            # Check if user exists in our users table
            existing_user = supabase.table('users').select('*').eq('email', user_data.email).execute()
            
            if existing_user.data:
                # User exists, update with social data
                user_record = existing_user.data[0]
                is_new_user = False
                logger.info(f"Existing user logged in via {provider}: {user_data.email}")
            else:
                # Create new user from social data
                user_record = {
                    "email": user_data.email,
                    "password_hash": "",  # No password for social users
                    "first_name": user_data.user_metadata.get('first_name', user_data.user_metadata.get('name', '').split(' ')[0] if user_data.user_metadata.get('name') else 'User'),
                    "last_name": user_data.user_metadata.get('last_name', ' '.join(user_data.user_metadata.get('name', '').split(' ')[1:]) if user_data.user_metadata.get('name') else 'User'),
                    "is_active": True,
                    "social_provider": provider,
                    "social_id": user_data.id
                }
                
                result = supabase.table('users').insert(user_record).execute()
                if not result.data:
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail="Failed to create user record"
                    )
                
                user_record = result.data[0]
                is_new_user = True
                logger.info(f"New user created via {provider}: {user_data.email}")
            
            # Create our JWT token
            access_token = create_access_token(str(user_record['id']), user_record['email'])
            
            # Redirect to frontend with token
            redirect_url = f"http://localhost:3001/auth/success?token={access_token}&provider={provider}&new_user={is_new_user}"
            return RedirectResponse(url=redirect_url)
            
        else:
            # Handle error cases
            error = query_params.get('error', 'Unknown error')
            error_description = query_params.get('error_description', 'Authentication failed')
            
            logger.error(f"{provider} auth error: {error} - {error_description}")
            
            redirect_url = f"http://localhost:3001/auth/error?error={error}&description={error_description}"
            return RedirectResponse(url=redirect_url)
            
    except Exception as e:
        logger.error(f"Error handling {provider} callback: {str(e)}")
        redirect_url = f"http://localhost:3001/auth/error?error=callback_error&description={str(e)}"
        return RedirectResponse(url=redirect_url)

@router.post("/auth/social/verify")
async def verify_social_token(callback_data: SocialAuthCallback):
    """
    Verify social authentication token and return user data
    """
    try:
        # This endpoint can be used for client-side social auth flows
        # where the frontend handles the OAuth flow and sends us the token
        
        provider = callback_data.provider.lower()
        access_token = callback_data.access_token
        user_data = callback_data.user_data
        
        logger.info(f"Verifying social token for {provider}")
        
        # Extract user information
        email = user_data.get('email')
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not provided by social provider"
            )
        
        # Check if user exists
        existing_user = supabase.table('users').select('*').eq('email', email).execute()
        
        if existing_user.data:
            user_record = existing_user.data[0]
            is_new_user = False
        else:
            # Create new user
            name_parts = user_data.get('name', '').split(' ', 1)
            first_name = name_parts[0] if name_parts else 'User'
            last_name = name_parts[1] if len(name_parts) > 1 else 'User'
            
            user_record = {
                "email": email,
                "password_hash": "",
                "first_name": first_name,
                "last_name": last_name,
                "is_active": True,
                "social_provider": provider,
                "social_id": user_data.get('id', user_data.get('sub'))
            }
            
            result = supabase.table('users').insert(user_record).execute()
            if not result.data:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to create user record"
                )
            
            user_record = result.data[0]
            is_new_user = True
        
        # Create JWT token
        jwt_token = create_access_token(str(user_record['id']), user_record['email'])
        
        # Convert to response format
        user_response = user_to_response(user_record)
        
        return SocialAuthResponse(
            access_token=jwt_token,
            token_type="bearer",
            expires_in=24 * 3600,  # 24 hours
            user=user_response,
            provider=provider,
            is_new_user=is_new_user
        )
        
    except Exception as e:
        logger.error(f"Error verifying social token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify social authentication"
        )

@router.get("/auth/providers")
async def get_available_providers():
    """
    Get list of available social authentication providers
    """
    return JSONResponse(content={
        "providers": [
            {
                "name": "google",
                "display_name": "Google",
                "icon": "fab fa-google",
                "color": "#db4437"
            },
            {
                "name": "linkedin",
                "display_name": "LinkedIn", 
                "icon": "fab fa-linkedin",
                "color": "#0077b5"
            },
            {
                "name": "github",
                "display_name": "GitHub",
                "icon": "fab fa-github", 
                "color": "#333"
            },
            {
                "name": "microsoft",
                "display_name": "Microsoft",
                "icon": "fab fa-microsoft",
                "color": "#00a1f1"
            }
        ]
    })