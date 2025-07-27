from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from supabase_client import supabase

router = APIRouter()

@router.get("/debug/files")
async def debug_files():
    """Debug: Lister tous les fichiers uploadés"""
    try:
        # Récupérer tous les fichiers uploadés
        files_result = supabase.table("uploaded_files").select("*").execute()
        
        # Récupérer toutes les données structurées
        data_result = supabase.table("resume_structured_data").select("*").execute()
        
        return JSONResponse(content={
            "uploaded_files": files_result.data,
            "structured_data": data_result.data,
            "files_count": len(files_result.data),
            "data_count": len(data_result.data)
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du debug: {str(e)}")

@router.get("/cv_data/{file_id}")
async def get_cv_data(file_id: int):
    """Récupérer les données extraites d'un CV par son file_id"""
    try:
        # Récupérer les données structurées
        result = supabase.table("resume_structured_data").select("*").eq("file_id", file_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Données CV non trouvées")
        
        cv_data = result.data[0]
        
        return JSONResponse(content={
            "file_id": file_id,
            "data": cv_data["data"],
            "extraction_method": cv_data.get("extraction_method"),
            "extraction_date": cv_data.get("extraction_date")
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des données: {str(e)}")

@router.get("/extracted_data/{file_id}")
async def get_extracted_data(file_id: int):
    """Récupérer les données extraites d'un CV par son file_id (alias pour compatibilité)"""
    try:
        # Vérifier d'abord si le fichier existe
        file_result = supabase.table("uploaded_files").select("*").eq("id", file_id).execute()
        
        if not file_result.data:
            raise HTTPException(
                status_code=404, 
                detail=f"Fichier avec ID {file_id} non trouvé dans la base de données"
            )
        
        # Récupérer les données structurées
        result = supabase.table("resume_structured_data").select("*").eq("file_id", file_id).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=404, 
                detail=f"Données extraites non trouvées pour le fichier ID {file_id}. Le fichier existe mais n'a pas été traité par ChatGPT."
            )
        
        cv_data = result.data[0]
        
        # Vérifier si les données sont valides
        if not cv_data.get("data"):
            raise HTTPException(
                status_code=404,
                detail=f"Données vides pour le fichier ID {file_id}. L'extraction a peut-être échoué."
            )
        
        return JSONResponse(content={
            "file_id": file_id,
            "extracted_data": cv_data["data"],
            "extraction_method": cv_data.get("extraction_method"),
            "extraction_date": cv_data.get("extraction_date")
        })
        
    except HTTPException:
        # Re-raise les erreurs HTTP
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des données: {str(e)}")

@router.get("/cv_data_by_ocr_id/{ocr_result_id}")
async def get_cv_data_by_ocr_id(ocr_result_id: int):
    """Récupérer les données extraites d'un CV par son ocr_result_id (pour compatibilité)"""
    try:
        # Récupérer les données structurées
        result = supabase.table("resume_structured_data").select("*").eq("ocr_result_id", ocr_result_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Données CV non trouvées")
        
        cv_data = result.data[0]
        
        return JSONResponse(content={
            "ocr_result_id": ocr_result_id,
            "file_id": cv_data.get("file_id"),
            "data": cv_data["data"],
            "extraction_method": cv_data.get("extraction_method"),
            "extraction_date": cv_data.get("extraction_date")
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des données: {str(e)}") 