#!/usr/bin/env python3
"""
Authentication endpoints for CVIA
"""

from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from auth import (
    UserRegistration, 
    UserLogin, 
    TokenResponse, 
    UserResponse,
    create_user_in_db,
    authenticate_user,
    create_access_token,
    get_current_user,
    user_to_response,
    JWT_EXPIRATION_HOURS
)
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
async def register_user(user_data: UserRegistration):
    """
    Register a new user
    """
    try:
        logger.info(f"Registration attempt for email: {user_data.email}")
        
        # Create user in database
        user = await create_user_in_db(user_data)
        
        # Create access token
        access_token = create_access_token(str(user['id']), user['email'])
        
        # Convert user to response format
        user_response = user_to_response(user)
        
        logger.info(f"User registered successfully: {user['email']}")
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=JWT_EXPIRATION_HOURS * 3600,  # Convert hours to seconds
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during registration"
        )

@router.post("/login", response_model=TokenResponse)
async def login_user(login_data: UserLogin):
    """
    Login user with email and password
    """
    try:
        logger.info(f"Login attempt for email: {login_data.email}")
        
        # Authenticate user
        user = await authenticate_user(login_data.email, login_data.password)
        
        if not user:
            logger.warning(f"Failed login attempt for email: {login_data.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Create access token
        access_token = create_access_token(str(user['id']), user['email'])
        
        # Convert user to response format
        user_response = user_to_response(user)
        
        logger.info(f"User logged in successfully: {user['email']}")
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=JWT_EXPIRATION_HOURS * 3600,  # Convert hours to seconds
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during login"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """
    Get current user information
    """
    try:
        return user_to_response(current_user)
    except Exception as e:
        logger.error(f"Error getting user info: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving user information"
        )

@router.post("/logout")
async def logout_user(current_user: dict = Depends(get_current_user)):
    """
    Logout user (client-side token removal)
    """
    try:
        logger.info(f"User logged out: {current_user['email']}")
        return JSONResponse(content={
            "message": "Successfully logged out",
            "detail": "Please remove the token from client storage"
        })
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error during logout"
        )

@router.get("/health")
async def auth_health_check():
    """
    Health check for authentication service
    """
    return JSONResponse(content={
        "status": "healthy",
        "service": "authentication",
        "message": "Authentication service is running"
    })