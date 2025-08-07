import os
from dotenv import load_dotenv

# Charger les variables d'environnement depuis .env si le fichier existe
load_dotenv()

# Configuration Supabase (synchronisée avec supabase_client.py)
SUPABASE_URL = os.getenv("SUPABASE_URL", "your_supabase_url_here")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "your_supabase_key_here")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "your_bucket_name")

# Configuration des clés API
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")
REPLICATE_API_KEY = os.getenv("REPLICATE_API_KEY", "")

def check_mistral_api_key():
    """Vérifier si la clé API Mistral est configurée"""
    if not MISTRAL_API_KEY:
        print("❌ MISTRAL_API_KEY n'est pas configurée!")
        return False
    else:
        print(f"✅ MISTRAL_API_KEY configurée (longueur: {len(MISTRAL_API_KEY)} caractères)")
        return True

def check_openai_api_key():
    """Vérifier si la clé API OpenAI est configurée"""
    if not OPENAI_API_KEY:
        print("❌ OPENAI_API_KEY n'est pas configurée!")
        return False
    else:
        print(f"✅ OPENAI_API_KEY configurée (longueur: {len(OPENAI_API_KEY)} caractères)")
        return True

def check_huggingface_api_key():
    """Vérifier si la clé API Hugging Face est configurée"""
    if not HUGGINGFACE_API_KEY:
        print("❌ HUGGINGFACE_API_KEY n'est pas configurée!")
        return False
    else:
        print(f"✅ HUGGINGFACE_API_KEY configurée (longueur: {len(HUGGINGFACE_API_KEY)} caractères)")
        return True

def check_replicate_api_key():
    """Vérifier si la clé API Replicate est configurée"""
    if not REPLICATE_API_KEY:
        print("❌ REPLICATE_API_KEY n'est pas configurée!")
        return False
    else:
        print(f"✅ REPLICATE_API_KEY configurée (longueur: {len(REPLICATE_API_KEY)} caractères)")
        return True 