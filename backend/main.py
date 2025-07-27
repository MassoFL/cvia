import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from upload_endpoint import router as upload_router
from data_endpoint import router as data_router

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
            "upload": "/api/v1/upload",
            "extracted_data": "/api/v1/extracted_data/{file_id}",
            "debug": "/api/v1/debug/files"
        }
    })

# Inclure les endpoints avec préfixes
app.include_router(upload_router, prefix="/api/v1")
app.include_router(data_router, prefix="/api/v1")