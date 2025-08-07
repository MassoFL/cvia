#!/usr/bin/env python3
"""
Resume management endpoints for CVIA
Handles CRUD operations for stored resumes
"""

from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import JSONResponse, RedirectResponse
from typing import Optional, List
import logging
from auth import get_current_user
from resume_storage import resume_storage

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/resumes")
async def get_user_resumes(
    current_user: dict = Depends(get_current_user),
    limit: int = Query(default=10, ge=1, le=100),
    offset: int = Query(default=0, ge=0)
):
    """
    Get all resumes for the current user
    """
    try:
        user_id = str(current_user['id'])
        resumes = await resume_storage.get_user_resumes(user_id)
        
        # Apply pagination
        total_count = len(resumes)
        paginated_resumes = resumes[offset:offset + limit]
        
        return JSONResponse(content={
            "resumes": paginated_resumes,
            "total_count": total_count,
            "limit": limit,
            "offset": offset,
            "has_more": offset + limit < total_count
        })
        
    except Exception as e:
        logger.error(f"Error getting user resumes: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/resumes/{resume_id}")
async def get_resume(
    resume_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get a specific resume by ID
    """
    try:
        user_id = str(current_user['id'])
        resume = await resume_storage.get_resume_by_id(resume_id, user_id)
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        return JSONResponse(content={"resume": resume})
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting resume: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/resumes/{resume_id}/download")
async def download_resume(
    resume_id: str,
    current_user: dict = Depends(get_current_user),
    expires_in: int = Query(default=3600, ge=300, le=86400)  # 5 min to 24 hours
):
    """
    Get a signed download URL for a resume
    """
    try:
        user_id = str(current_user['id'])
        download_url = await resume_storage.get_resume_download_url(
            resume_id, user_id, expires_in
        )
        
        return JSONResponse(content={
            "download_url": download_url,
            "expires_in": expires_in,
            "message": "Download URL generated successfully"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating download URL: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/resumes/{resume_id}/download-direct")
async def download_resume_direct(
    resume_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Direct download redirect for a resume
    """
    try:
        user_id = str(current_user['id'])
        download_url = await resume_storage.get_resume_download_url(
            resume_id, user_id, expires_in=300  # 5 minutes for direct download
        )
        
        # Redirect to the signed URL
        return RedirectResponse(url=download_url, status_code=302)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in direct download: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/resumes/{resume_id}")
async def update_resume(
    resume_id: str,
    update_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """
    Update resume data (structured data, raw text, status)
    """
    try:
        user_id = str(current_user['id'])
        
        # Extract allowed update fields
        structured_data = update_data.get('structured_data')
        raw_text = update_data.get('raw_text')
        status = update_data.get('status')
        
        updated_resume = await resume_storage.update_resume_data(
            resume_id=resume_id,
            user_id=user_id,
            structured_data=structured_data,
            raw_text=raw_text,
            status=status
        )
        
        return JSONResponse(content={
            "message": "Resume updated successfully",
            "resume": updated_resume
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating resume: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/resumes/{resume_id}")
async def delete_resume(
    resume_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a resume (both file and database record)
    """
    try:
        user_id = str(current_user['id'])
        success = await resume_storage.delete_resume(resume_id, user_id)
        
        if success:
            return JSONResponse(content={
                "message": "Resume deleted successfully",
                "resume_id": resume_id
            })
        else:
            raise HTTPException(status_code=500, detail="Failed to delete resume")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting resume: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/resumes/{resume_id}/structured-data")
async def get_resume_structured_data(
    resume_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get only the structured data for a resume
    """
    try:
        user_id = str(current_user['id'])
        resume = await resume_storage.get_resume_by_id(resume_id, user_id)
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        return JSONResponse(content={
            "resume_id": resume_id,
            "structured_data": resume.get('structured_data', {}),
            "cv_name": resume.get('cv_name', ''),
            "status": resume.get('status', ''),
            "created_at": resume.get('created_at', ''),
            "updated_at": resume.get('updated_at', '')
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting structured data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/resumes/{resume_id}/raw-text")
async def get_resume_raw_text(
    resume_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get only the raw text for a resume
    """
    try:
        user_id = str(current_user['id'])
        resume = await resume_storage.get_resume_by_id(resume_id, user_id)
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        return JSONResponse(content={
            "resume_id": resume_id,
            "raw_text": resume.get('raw_text', ''),
            "raw_text_length": len(resume.get('raw_text', '')),
            "cv_name": resume.get('cv_name', ''),
            "status": resume.get('status', ''),
            "created_at": resume.get('created_at', ''),
            "updated_at": resume.get('updated_at', '')
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting raw text: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/storage/stats")
async def get_storage_stats(
    current_user: dict = Depends(get_current_user)
):
    """
    Get storage statistics for the current user
    """
    try:
        user_id = str(current_user['id'])
        resumes = await resume_storage.get_user_resumes(user_id)
        
        total_files = len(resumes)
        total_size = sum(resume.get('file_size', 0) for resume in resumes)
        
        # Calculate size in different units
        size_mb = total_size / (1024 * 1024)
        size_gb = size_mb / 1024
        
        # Group by status
        status_counts = {}
        for resume in resumes:
            status = resume.get('status', 'unknown')
            status_counts[status] = status_counts.get(status, 0) + 1
        
        return JSONResponse(content={
            "user_id": user_id,
            "total_files": total_files,
            "total_size_bytes": total_size,
            "total_size_mb": round(size_mb, 2),
            "total_size_gb": round(size_gb, 4),
            "status_breakdown": status_counts,
            "average_file_size_mb": round(size_mb / total_files, 2) if total_files > 0 else 0
        })
        
    except Exception as e:
        logger.error(f"Error getting storage stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    """
    Health check for resume management service
    """
    return JSONResponse(content={
        "status": "healthy",
        "service": "resume_management",
        "message": "Resume management service is ready"
    })