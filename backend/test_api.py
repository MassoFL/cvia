#!/usr/bin/env python3
"""
Script de test pour vérifier que l'API fonctionne correctement
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_debug_endpoint():
    """Test de l'endpoint de debug"""
    print("🔍 Test de l'endpoint de debug...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/debug/files")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Debug endpoint OK")
            print(f"   Fichiers uploadés: {data['files_count']}")
            print(f"   Données structurées: {data['data_count']}")
            return data
        else:
            print(f"❌ Debug endpoint failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Erreur lors du test debug: {e}")
        return None

def test_extracted_data_endpoint(file_id):
    """Test de l'endpoint extracted_data"""
    print(f"🔍 Test de l'endpoint extracted_data pour file_id={file_id}...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/extracted_data/{file_id}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Extracted data endpoint OK")
            print(f"   File ID: {data['file_id']}")
            print(f"   Extraction method: {data['extraction_method']}")
            return data
        elif response.status_code == 404:
            print(f"⚠️  Données non trouvées pour file_id={file_id}")
            return None
        else:
            print(f"❌ Extracted data endpoint failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Erreur lors du test extracted_data: {e}")
        return None

def test_upload_status_endpoint(file_id):
    """Test de l'endpoint upload_status"""
    print(f"🔍 Test de l'endpoint upload_status pour file_id={file_id}...")
    try:
        response = requests.get(f"{BASE_URL}/api/v1/upload_status/{file_id}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Upload status endpoint OK")
            print(f"   File ID: {data['file_id']}")
            print(f"   Status: {data['status']}")
            print(f"   Filename: {data['filename']}")
            return data
        elif response.status_code == 404:
            print(f"⚠️  Fichier non trouvé pour file_id={file_id}")
            return None
        else:
            print(f"❌ Upload status endpoint failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Erreur lors du test upload_status: {e}")
        return None

def main():
    """Fonction principale de test"""
    print("🚀 Test de l'API CVIA")
    print("=" * 50)
    
    # Test de l'endpoint de debug
    debug_data = test_debug_endpoint()
    
    if debug_data and debug_data['files_count'] > 0:
        # Test avec le premier fichier trouvé
        first_file = debug_data['uploaded_files'][0]
        file_id = first_file['id']
        
        print(f"\n📁 Test avec le fichier ID: {file_id}")
        print(f"   Nom: {first_file.get('filename', 'N/A')}")
        print(f"   Status: {first_file.get('status', 'N/A')}")
        
        # Test de l'endpoint upload_status
        test_upload_status_endpoint(file_id)
        
        # Test de l'endpoint extracted_data
        test_extracted_data_endpoint(file_id)
        
    else:
        print("\n⚠️  Aucun fichier trouvé dans la base de données")
        print("   Essayez d'uploader un CV d'abord")
    
    print("\n" + "=" * 50)
    print("✅ Tests terminés")

if __name__ == "__main__":
    main() 