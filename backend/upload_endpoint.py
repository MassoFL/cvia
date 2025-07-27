import os
import uuid
import json
import re
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import tempfile
from openai import OpenAI
from supabase_client import supabase, SUPABASE_BUCKET
from config import OPENAI_API_KEY

router = APIRouter()

# Pas de fonctions d'extraction préconçues - on copie fidèlement ChatGPT

def extract_cv_with_chatgpt(file_path: str, filename: str) -> dict:
    """Extrait les informations du CV en utilisant l'Assistant OpenAI"""
    file_id = None
    thread_id = None
    run_id = None
    try:
        client = OpenAI(api_key=OPENAI_API_KEY)
        ASSISTANT_ID = "asst_WUGIISQND2sf1PMXok9QZdUt"
        
        # 1. Uploader le fichier vers OpenAI
        print(f"📤 Upload du fichier {filename} vers OpenAI...")
        with open(file_path, 'rb') as file:
            response = client.files.create(
                file=file,
                purpose="assistants"
            )
        file_id = response.id
        print(f"✅ Fichier uploadé avec l'ID: {file_id}")
        
        # 2. Créer un thread
        thread = client.beta.threads.create()
        thread_id = thread.id
        print(f"🧵 Thread créé avec l'ID: {thread_id}")
        
        # 3. Ajouter le message avec le fichier au thread
        message = client.beta.threads.messages.create(
            thread_id=thread_id,
            role="user",
            content="""Analyse ce CV de manière exhaustive et détaillée.

IMPORTANT : 
- Extrais TOUTES les informations du CV sans rien oublier
- Ne laisse AUCUNE information de côté (même les détails les plus petits)
- Copie exactement le texte du CV, lettre par lettre, virgule par virgule, point par point
- Donne-moi une analyse texte libre, sans format JSON
- Organise tes réponses par sections naturelles (personnel, formation, expériences, compétences, etc.)
- Sois ultra-détaillé et exhaustif""",
            attachments=[{"file_id": file_id, "tools": [{"type": "file_search"}]}]
        )
        print(f"💬 Message ajouté au thread")
        
        # 4. Lancer l'assistant
        run = client.beta.threads.runs.create(
            thread_id=thread_id,
            assistant_id=ASSISTANT_ID
        )
        run_id = run.id
        print(f"🚀 Assistant lancé avec l'ID: {run_id}")
        
        # 5. Attendre que l'assistant termine
        while True:
            run_status = client.beta.threads.runs.retrieve(
                thread_id=thread_id,
                run_id=run_id
            )
            print(f"📊 Statut: {run_status.status}")
            
            if run_status.status == "completed":
                break
            elif run_status.status == "failed":
                raise Exception(f"L'assistant a échoué: {run_status.last_error}")
            elif run_status.status == "expired":
                raise Exception("L'assistant a expiré")
            
            import time
            time.sleep(2)  # Attendre 2 secondes avant de vérifier à nouveau
        
        # 6. Récupérer la réponse
        messages = client.beta.threads.messages.list(thread_id=thread_id)
        assistant_message = messages.data[0]  # Le premier message est la réponse de l'assistant
        
        if assistant_message.content and len(assistant_message.content) > 0:
            content = assistant_message.content[0].text.value.strip()
        else:
            raise Exception("Aucune réponse reçue de l'assistant")
        
        # Nettoyer la réponse
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
        
        # Debug: Afficher le contenu brut reçu
        print("📄 Contenu brut reçu de l'assistant:")
        print("=" * 80)
        print(content)
        print("=" * 80)
        print(f"📏 Longueur du contenu: {len(content)} caractères")
        
        # Copier fidèlement le contenu de ChatGPT sans structure préconçue
        print("🔍 Copie fidèle du contenu de ChatGPT...")
        print("📝 Format: COPIE EXACTE")
        
        # Diviser le contenu en sections selon ce que ChatGPT propose
        sections = re.split(r'\n\s*(?:===|###|##|#|\*\*|__)\s*', content)
        
        # Créer une structure dynamique basée sur les sections de ChatGPT
        extracted_data = {
            "raw_content": content,
            "format": "exact_copy"
        }
        
        # Ajouter chaque section telle quelle
        for i, section in enumerate(sections):
            section = section.strip()
            if not section:
                continue
            
            # Utiliser le titre de la section comme clé
            lines = section.split('\n')
            if lines:
                # Prendre la première ligne comme titre de section
                section_title = lines[0].strip().lower().replace(' ', '_').replace(':', '').replace('-', '_')
                section_content = '\n'.join(lines[1:]) if len(lines) > 1 else section
                
                # Ajouter la section à la structure
                extracted_data[section_title] = section_content
        
        # Le parsing est maintenant géré dans la section précédente
        pass
        
                # Debug: Afficher la structure des données extraites
        print("🔍 Structure des données extraites:")
        print("=" * 80)
        print(json.dumps(extracted_data, indent=2, ensure_ascii=False))
        print("=" * 80)
        
        # Afficher un résumé détaillé
        print("📊 RÉSUMÉ DÉTAILLÉ DE L'EXTRACTION:")
        print("-" * 50)
        if 'personal_info' in extracted_data:
            personal = extracted_data['personal_info']
            print(f"👤 Informations personnelles:")
            print(f"   - Nom: {personal.get('name', 'Non trouvé')}")
            print(f"   - Email: {personal.get('email', 'Non trouvé')}")
            print(f"   - Téléphone: {personal.get('phone', 'Non trouvé')}")
        
        if 'experiences' in extracted_data:
            experiences = extracted_data['experiences']
            print(f"💼 Expériences: {len(experiences)} trouvées")
            for i, exp in enumerate(experiences, 1):
                print(f"   {i}. {exp.get('title', 'Sans titre')} chez {exp.get('company', 'Entreprise inconnue')}")
        
        if 'education' in extracted_data:
            education = extracted_data['education']
            print(f"🎓 Formation: {len(education)} trouvée(s)")
            for i, edu in enumerate(education, 1):
                print(f"   {i}. {edu.get('degree', 'Diplôme inconnu')} - {edu.get('institution', 'Établissement inconnu')}")
        
        if 'skills' in extracted_data:
            skills = extracted_data['skills']
            total_skills = sum(len(v) if isinstance(v, list) else 0 for v in skills.values())
            print(f"🛠️ Compétences: {total_skills} au total")
            for category, skill_list in skills.items():
                if isinstance(skill_list, list) and skill_list:
                    print(f"   - {category}: {len(skill_list)} compétences")
        
        print("-" * 50)
        
        # Validation de la structure avec flexibilité maximale
        print("🔍 Validation de la structure des données...")
        
        # Analyser la structure générée par ChatGPT
        print("📋 Structure générée par ChatGPT:")
        for key, value in extracted_data.items():
            if isinstance(value, list):
                print(f"  - {key}: {len(value)} éléments")
            elif isinstance(value, dict):
                print(f"  - {key}: {len(value)} champs")
            else:
                print(f"  - {key}: {type(value).__name__}")
        
        # Normaliser les structures communes si elles existent
        if 'skills' in extracted_data and isinstance(extracted_data['skills'], dict):
            # Normaliser les compétences si c'est un objet
            skill_categories = ['technical', 'soft', 'languages', 'tools', 'methodologies', 'frameworks', 'databases', 'cloud']
            for category in skill_categories:
                if category not in extracted_data['skills']:
                    extracted_data['skills'][category] = []
        elif 'skills' in extracted_data and isinstance(extracted_data['skills'], list):
            # Si skills est une liste, la convertir en objet
            extracted_data['skills'] = {'technical': extracted_data['skills']}
        
        # Normaliser les expériences si c'est une liste
        if 'experiences' in extracted_data and not isinstance(extracted_data['experiences'], list):
            extracted_data['experiences'] = [extracted_data['experiences']]
        
        # Normaliser l'éducation si c'est une liste
        if 'education' in extracted_data and not isinstance(extracted_data['education'], list):
            extracted_data['education'] = [extracted_data['education']]
        
        # Afficher un résumé de ce qui a été extrait
        print("📊 Résumé de l'extraction:")
        for key, value in extracted_data.items():
            if isinstance(value, list):
                print(f"  - {key}: {len(value)} éléments")
            elif isinstance(value, dict):
                if key == 'skills':
                    total_skills = sum(len(v) if isinstance(v, list) else 0 for v in value.values())
                    print(f"  - {key}: {total_skills} compétences au total")
                else:
                    print(f"  - {key}: {len(value)} champs")
            else:
                print(f"  - {key}: {type(value).__name__}")
        
        return extracted_data

    except Exception as e:
        print(f"Erreur lors de l'extraction avec l'assistant: {e}")
        raise
    finally:
        # Nettoyer : supprimer le fichier et le thread
        if file_id:
            try:
                client.files.delete(file_id)
                print(f"🗑️ Fichier OpenAI supprimé: {file_id}")
            except Exception as e:
                print(f"⚠️ Erreur suppression fichier OpenAI: {e}")
        
        if thread_id:
            try:
                client.beta.threads.delete(thread_id)
                print(f"🗑️ Thread supprimé: {thread_id}")
            except Exception as e:
                print(f"⚠️ Erreur suppression thread: {e}")

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Endpoint pour uploader un fichier CV et extraire les données avec ChatGPT"""
    try:
        # Validation du fichier
        if not file.filename:
            raise HTTPException(status_code=400, detail="Nom de fichier manquant")
        
        # Vérifier l'extension
        allowed_extensions = {'.pdf', '.docx', '.doc'}
        file_extension = os.path.splitext(file.filename.lower())[1]
        
        if file_extension not in allowed_extensions:
            raise HTTPException(
                status_code=400, 
                detail=f"Type de fichier non supporté. Types autorisés: {', '.join(allowed_extensions)}"
            )
        
        # Vérifier la taille (max 10MB)
        if file.size and file.size > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Fichier trop volumineux (max 10MB)")
        
        # Générer un ID unique
        file_id = str(uuid.uuid4())
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"cv_{file_id}_{timestamp}{file_extension}"
        
        # Sauvegarder temporairement le fichier
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        
        try:
            print(f"🔍 Extraction des données avec ChatGPT pour {filename}")
            
            # Extraire les données avec ChatGPT
            extracted_data = extract_cv_with_chatgpt(temp_file_path, filename)
            
            # Upload vers Supabase Storage
            supabase.storage.from_(SUPABASE_BUCKET).upload(
                path=filename,
                file=content,
                file_options={"content-type": file.content_type}
            )
            
            # Enregistrer dans la base de données
            file_record = {
                "filename": filename,
                "content_type": file.content_type,
                "storage_path": filename
            }
            
            file_result = supabase.table("uploaded_files").insert(file_record).execute()
            db_file_id = file_result.data[0]['id']
            
            data_record = {
                "file_id": db_file_id,
                "data": extracted_data
            }
            
            supabase.table("resume_structured_data").insert(data_record).execute()
            
            return JSONResponse(content={
                "file_id": db_file_id,  # Return the database ID instead of UUID
                "filename": filename,
                "extracted_data": extracted_data,
                "status": "success",
                "message": "CV téléchargé et extrait avec succès"
            })
            
        finally:
            # Nettoyer le fichier temporaire
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
                
    except Exception as e:
        print(f"Erreur lors de l'upload: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur lors du traitement: {str(e)}")

@router.get("/upload_status/{file_id}")
async def get_upload_status(file_id: str):
    """Récupère le statut d'un upload"""
    try:
        return JSONResponse(content={
            "file_id": file_id,
            "status": "completed",
            "message": "Extraction terminée"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur: {str(e)}")

 