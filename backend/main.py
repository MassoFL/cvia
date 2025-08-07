import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from working_extraction_endpoint import router as working_extraction_router
from auth_endpoints import router as auth_router
from social_auth import router as social_auth_router
from resume_endpoints import router as resume_router
from job_summary_endpoints import router as job_summary_router

# Import pour le nettoyage au démarrage
from supabase_client import supabase

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Endpoint de test pour vérifier que l'API fonctionne"""
    return JSONResponse(content={
        "message": "CVIA API is running!",
        "version": "1.0.0",
        "endpoints": {
            "working_extraction": "/api/v1/extract_structured_data_working",
            "working_extraction_health": "/api/v1/health_working",
            "auth_register": "/api/v1/auth/register",
            "auth_login": "/api/v1/auth/login",
            "auth_me": "/api/v1/auth/me",
            "auth_logout": "/api/v1/auth/logout",
            "social_auth_google": "/api/v1/social/auth/google",
            "social_auth_linkedin": "/api/v1/social/auth/linkedin",
            "social_auth_github": "/api/v1/social/auth/github",
            "social_auth_microsoft": "/api/v1/social/auth/microsoft",
            "social_providers": "/api/v1/social/auth/providers",
            "resumes_list": "/api/v1/resumes",
            "resume_get": "/api/v1/resumes/{resume_id}",
            "resume_download": "/api/v1/resumes/{resume_id}/download",
            "resume_delete": "/api/v1/resumes/{resume_id}",
            "storage_stats": "/api/v1/storage/stats",
            "job_summary": "/generate_job_summary/",
            "job_summary_health": "/health_job_summary",
            "validate_job_description": "/validate_job_description/",
            "align_experiences": "/align_experiences/",
            "extract_skills": "/extract_skills/",
            "extract_url_content": "/extract_url_content/"
        }
    })

# Inclure les endpoints avec préfixes
app.include_router(working_extraction_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(social_auth_router, prefix="/api/v1/social")
app.include_router(resume_router, prefix="/api/v1")
app.include_router(job_summary_router)