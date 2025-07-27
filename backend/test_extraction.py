#!/usr/bin/env python3
"""
Script de test pour l'extraction directe avec ChatGPT
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from direct_extraction_endpoint import extract_cv_directly_optimized

def test_extraction(file_id):
    """Test l'extraction pour un file_id donné"""
    print(f"🧪 Testing extraction for file_id: {file_id}")
    
    try:
        extract_cv_directly_optimized(file_id)
        print(f"✅ Extraction completed successfully for file_id: {file_id}")
    except Exception as e:
        print(f"❌ Extraction failed for file_id: {file_id}")
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python test_extraction.py <file_id>")
        sys.exit(1)
    
    try:
        file_id = int(sys.argv[1])
        test_extraction(file_id)
    except ValueError:
        print("❌ file_id must be an integer")
        sys.exit(1) 