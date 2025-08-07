#!/usr/bin/env python3
"""
Resume storage module for CVIA
Handles PDF storage in Supabase and database record management
"""

import os
import uuid
import logging
from datetime import datetime
from typing import Optional, Dict, Any, Tuple
from fastapi import HTTPException, UploadFile
from supabase_client import supabase, SUPABASE_BUCKET
import tempfile

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ResumeStorage:
    """Handle resume PDF storage and database operations"""
    
    def __init__(self):
        self.bucket_name = SUPABASE_BUCKET
        
    async def store_resume_pdf(
        self, 
        file: UploadFile, 
        user_id: str,
        structured_data: Optional[Dict[str, Any]] = None,
        raw_text: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Store resume PDF in Supabase storage and create database record
        
        Args:
            file: Uploaded PDF file
            user_id: ID of the user uploading the resume
            structured_data: Extracted structured data from the resume
            raw_text: Raw text extracted from the resume
            
        Returns:
            Dict containing resume record information
        """
        try:
            # Generate unique filename
            file_extension = os.path.splitext(file.filename)[1].lower()
            unique_filename = f"resume_{uuid.uuid4()}{file_extension}"
            storage_path = f"resumes/{user_id}/{unique_filename}"
            
            logger.info(f"Storing resume: {file.filename} -> {storage_path}")
            
            # Read file content
            file_content = await file.read()
            
            # Reset file pointer for potential reuse
            await file.seek(0)
            
            # Upload to Supabase storage
            storage_result = supabase.storage.from_(self.bucket_name).upload(
                path=storage_path,
                file=file_content,
                file_options={
                    "content-type": "application/pdf"
                }
            )
            
            if hasattr(storage_result, 'error') and storage_result.error:
                logger.error(f"Storage upload failed: {storage_result.error}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to upload file to storage: {storage_result.error}"
                )
            
            # Get public URL for the uploaded file
            public_url = supabase.storage.from_(self.bucket_name).get_public_url(storage_path)
            
            # Create database record
            resume_record = {
                "user_id": user_id,
                "cv_name": os.path.splitext(file.filename)[0],  # Name without extension
                "original_filename": file.filename,
                "file_path": storage_path,
                "file_url": public_url,
                "file_size": len(file_content),
                "structured_data": structured_data or {},
                "raw_text": raw_text or "",
                "status": "processed" if structured_data else "uploaded",
                "created_at": datetime.utcnow().isoformat()
            }
            
            # Insert into database
            db_result = supabase.table('user_cvs').insert(resume_record).execute()
            
            if not db_result.data:
                # If database insert fails, try to clean up the uploaded file
                try:
                    supabase.storage.from_(self.bucket_name).remove([storage_path])
                except Exception as cleanup_error:
                    logger.error(f"Failed to cleanup uploaded file: {cleanup_error}")
                
                raise HTTPException(
                    status_code=500,
                    detail="Failed to create database record for resume"
                )
            
            created_record = db_result.data[0]
            
            logger.info(f"Resume stored successfully: {created_record['id']}")
            
            return {
                "id": created_record["id"],
                "cv_name": created_record["cv_name"],
                "original_filename": created_record["original_filename"],
                "file_url": created_record["file_url"],
                "file_size": created_record["file_size"],
                "status": created_record["status"],
                "created_at": created_record["created_at"],
                "has_structured_data": bool(structured_data),
                "has_raw_text": bool(raw_text)
            }
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error storing resume: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Internal server error during resume storage: {str(e)}"
            )
    
    async def get_user_resumes(self, user_id: str) -> list[Dict[str, Any]]:
        """
        Get all resumes for a specific user
        
        Args:
            user_id: ID of the user
            
        Returns:
            List of resume records
        """
        try:
            result = supabase.table('user_cvs').select('*').eq('user_id', user_id).order('created_at', desc=True).execute()
            
            return result.data or []
            
        except Exception as e:
            logger.error(f"Error getting user resumes: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to retrieve user resumes: {str(e)}"
            )
    
    async def get_resume_by_id(self, resume_id: str, user_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """
        Get a specific resume by ID
        
        Args:
            resume_id: ID of the resume
            user_id: Optional user ID for access control
            
        Returns:
            Resume record or None if not found
        """
        try:
            query = supabase.table('user_cvs').select('*').eq('id', resume_id)
            
            if user_id:
                query = query.eq('user_id', user_id)
            
            result = query.execute()
            
            return result.data[0] if result.data else None
            
        except Exception as e:
            logger.error(f"Error getting resume by ID: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to retrieve resume: {str(e)}"
            )
    
    async def update_resume_data(
        self, 
        resume_id: str, 
        user_id: str,
        structured_data: Optional[Dict[str, Any]] = None,
        raw_text: Optional[str] = None,
        status: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Update resume data (structured data, raw text, status)
        
        Args:
            resume_id: ID of the resume to update
            user_id: ID of the user (for access control)
            structured_data: Updated structured data
            raw_text: Updated raw text
            status: Updated status
            
        Returns:
            Updated resume record
        """
        try:
            update_data = {"updated_at": datetime.utcnow().isoformat()}
            
            if structured_data is not None:
                update_data["structured_data"] = structured_data
            
            if raw_text is not None:
                update_data["raw_text"] = raw_text
            
            if status is not None:
                update_data["status"] = status
            
            result = supabase.table('user_cvs').update(update_data).eq('id', resume_id).eq('user_id', user_id).execute()
            
            if not result.data:
                raise HTTPException(
                    status_code=404,
                    detail="Resume not found or access denied"
                )
            
            return result.data[0]
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error updating resume data: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to update resume: {str(e)}"
            )
    
    async def delete_resume(self, resume_id: str, user_id: str) -> bool:
        """
        Delete a resume (both file and database record)
        
        Args:
            resume_id: ID of the resume to delete
            user_id: ID of the user (for access control)
            
        Returns:
            True if deleted successfully
        """
        try:
            # First get the resume record to get the file path
            resume = await self.get_resume_by_id(resume_id, user_id)
            
            if not resume:
                raise HTTPException(
                    status_code=404,
                    detail="Resume not found or access denied"
                )
            
            # Delete from storage if file path exists
            if resume.get('file_path'):
                try:
                    supabase.storage.from_(self.bucket_name).remove([resume['file_path']])
                    logger.info(f"Deleted file from storage: {resume['file_path']}")
                except Exception as storage_error:
                    logger.warning(f"Failed to delete file from storage: {storage_error}")
                    # Continue with database deletion even if storage deletion fails
            
            # Delete from database
            result = supabase.table('user_cvs').delete().eq('id', resume_id).eq('user_id', user_id).execute()
            
            if not result.data:
                raise HTTPException(
                    status_code=404,
                    detail="Resume not found or access denied"
                )
            
            logger.info(f"Resume deleted successfully: {resume_id}")
            return True
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error deleting resume: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to delete resume: {str(e)}"
            )
    
    async def get_resume_download_url(self, resume_id: str, user_id: str, expires_in: int = 3600) -> str:
        """
        Get a signed URL for downloading a resume
        
        Args:
            resume_id: ID of the resume
            user_id: ID of the user (for access control)
            expires_in: URL expiration time in seconds (default: 1 hour)
            
        Returns:
            Signed download URL
        """
        try:
            # Get the resume record
            resume = await self.get_resume_by_id(resume_id, user_id)
            
            if not resume:
                raise HTTPException(
                    status_code=404,
                    detail="Resume not found or access denied"
                )
            
            if not resume.get('file_path'):
                raise HTTPException(
                    status_code=404,
                    detail="Resume file not found in storage"
                )
            
            # Generate signed URL
            signed_url = supabase.storage.from_(self.bucket_name).create_signed_url(
                path=resume['file_path'],
                expires_in=expires_in
            )
            
            if hasattr(signed_url, 'error') and signed_url.error:
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to generate download URL: {signed_url.error}"
                )
            
            return signed_url['signedURL']
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Error generating download URL: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to generate download URL: {str(e)}"
            )

# Global instance
resume_storage = ResumeStorage()