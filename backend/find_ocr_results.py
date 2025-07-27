#!/usr/bin/env python3
"""
Script pour lister les OCR results disponibles dans la base de données
"""

from supabase_client import supabase
import json

def list_ocr_results():
    """Liste tous les OCR results avec leurs informations"""
    try:
        print("🔍 Recherche des OCR results dans la base de données...")
        
        # Récupérer tous les OCR results avec les informations du fichier
        results = supabase.table("ocr_results").select(
            "id, text, confidence, file_id, created_at, uploaded_files(filename, content_type)"
        ).execute()
        
        if not results.data:
            print("❌ Aucun OCR result trouvé dans la base de données")
            return
        
        print(f"✅ {len(results.data)} OCR results trouvés\n")
        
        for i, result in enumerate(results.data, 1):
            print(f"📄 OCR Result #{i}")
            print(f"   • ID: {result['id']}")
            print(f"   • File ID: {result['file_id']}")
            print(f"   • Confidence: {result.get('confidence', 'N/A')}")
            print(f"   • Taille texte: {len(result['text'])} caractères")
            print(f"   • Créé le: {result['created_at']}")
            
            if result.get('uploaded_files'):
                file_info = result['uploaded_files']
                print(f"   • Fichier: {file_info.get('filename', 'N/A')}")
                print(f"   • Type: {file_info.get('content_type', 'N/A')}")
            
            # Aperçu du texte (premiers 100 caractères)
            text_preview = result['text'][:100].replace('\n', ' ').strip()
            print(f"   • Aperçu: {text_preview}...")
            print()
        
        # Suggestions pour les tests
        if results.data:
            print("💡 Suggestions pour les tests:")
            print(f"   • Test avec le plus récent: python test_chatgpt_performance.py {results.data[0]['id']}")
            print(f"   • Test avec le plus grand: python test_chatgpt_performance.py {max(results.data, key=lambda x: len(x['text']))['id']}")
            
    except Exception as e:
        print(f"❌ Erreur lors de la récupération: {e}")

def get_ocr_details(ocr_id: int):
    """Affiche les détails d'un OCR result spécifique"""
    try:
        print(f"🔍 Recherche du OCR result ID: {ocr_id}")
        
        result = supabase.table("ocr_results").select(
            "id, text, confidence, file_id, created_at, uploaded_files(filename, content_type)"
        ).eq("id", ocr_id).single().execute()
        
        if not result.data:
            print(f"❌ OCR result ID {ocr_id} non trouvé")
            return
        
        data = result.data
        print(f"✅ OCR result trouvé\n")
        print(f"📄 Détails OCR Result ID: {data['id']}")
        print(f"   • File ID: {data['file_id']}")
        print(f"   • Confidence: {data.get('confidence', 'N/A')}")
        print(f"   • Taille texte: {len(data['text'])} caractères")
        print(f"   • Créé le: {data['created_at']}")
        
        if data.get('uploaded_files'):
            file_info = data['uploaded_files']
            print(f"   • Fichier: {file_info.get('filename', 'N/A')}")
            print(f"   • Type: {file_info.get('content_type', 'N/A')}")
        
        print(f"\n📝 Texte complet:")
        print("-" * 50)
        print(data['text'])
        print("-" * 50)
        
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        # Afficher les détails d'un OCR result spécifique
        try:
            ocr_id = int(sys.argv[1])
            get_ocr_details(ocr_id)
        except ValueError:
            print("❌ L'ID OCR doit être un nombre entier")
    else:
        # Lister tous les OCR results
        list_ocr_results() 