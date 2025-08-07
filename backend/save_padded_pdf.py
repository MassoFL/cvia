#!/usr/bin/env python3
"""
Script pour sauvegarder le PDF avec padding pour comparaison
"""

import os
import fitz  # PyMuPDF
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def save_padded_pdf(pdf_path, padding_top=50, padding_bottom=50, suffix=""):
    """
    Ajoute un padding et sauvegarde le PDF dans le même répertoire
    """
    try:
        logger.info(f"Adding padding: top={padding_top}, bottom={padding_bottom}")
        
        # Ouvrir le PDF
        doc = fitz.open(pdf_path)
        new_doc = fitz.open()
        
        logger.info(f"Original PDF has {len(doc)} pages")
        
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            
            # Obtenir les dimensions de la page
            rect = page.rect
            width = rect.width
            height = rect.height
            
            # Calculer les nouvelles dimensions avec padding
            new_height = height + padding_top + padding_bottom
            
            logger.info(f"Page {page_num + 1}: {width}x{height} -> {width}x{new_height}")
            
            # Créer une nouvelle page avec padding en haut et en bas
            new_page = new_doc.new_page(width=width, height=new_height)
            
            # Remplir toute la page en blanc
            white_rect = fitz.Rect(0, 0, width, new_height)
            new_page.draw_rect(white_rect, color=(1, 1, 1), fill=(1, 1, 1))
            
            # Ajouter du texte "TEXT TO BE DELETED" en gras dans la zone de padding du haut
            if padding_top > 0:
                # Texte en haut
                text_rect_top = fitz.Rect(10, 10, width - 10, padding_top - 10)
                new_page.insert_text(
                    (20, 30),  # Position (x, y)
                    "TEXT TO BE DELETED - TOP PADDING",
                    fontsize=20,
                    color=(0, 0, 0),  # Noir
                    fontname="helv"  # Police standard
                )
            
            # Ajouter du texte "TEXT TO BE DELETED" en gras dans la zone de padding du bas
            if padding_bottom > 0:
                # Texte en bas
                bottom_y = padding_top + height + 30
                new_page.insert_text(
                    (20, bottom_y),  # Position (x, y)
                    "TEXT TO BE DELETED - BOTTOM PADDING",
                    fontsize=20,
                    color=(0, 0, 0),  # Noir
                    fontname="helv"  # Police standard
                )
            
            # Copier le contenu de la page originale avec décalage vers le bas
            new_page.show_pdf_page(
                fitz.Rect(0, padding_top, width, padding_top + height),
                doc,
                page_num
            )
        
        # Sauvegarder le nouveau PDF dans le même répertoire
        directory = os.path.dirname(pdf_path)
        filename = os.path.basename(pdf_path)
        name_without_ext = os.path.splitext(filename)[0]
        padded_pdf_path = os.path.join(directory, f"{name_without_ext}_WITH_PADDING_{padding_top}px{suffix}.pdf")
        
        new_doc.save(padded_pdf_path)
        new_doc.close()
        doc.close()
        
        logger.info(f"Padded PDF saved to: {padded_pdf_path}")
        print(f"✅ PDF avec padding {padding_top}px sauvegardé: {padded_pdf_path}")
        return padded_pdf_path
        
    except Exception as e:
        logger.error(f"Erreur lors de l'ajout de padding: {str(e)}")
        return pdf_path

if __name__ == "__main__":
    # Test avec le CV de Mohamed
    pdf_path = "../CV_Mohamed_ASSIMI (1).pdf"
    
    if os.path.exists(pdf_path):
        print(f"📄 Traitement du fichier: {pdf_path}")
        
        # Créer version avec padding 50px (actuel)
        save_padded_pdf(pdf_path, padding_top=50, padding_bottom=50, suffix="_50px")
        
        # Créer version avec padding 100px (plus de padding)
        save_padded_pdf(pdf_path, padding_top=100, padding_bottom=100, suffix="_100px")
        
        # Créer version avec padding 150px (encore plus de padding)
        save_padded_pdf(pdf_path, padding_top=150, padding_bottom=150, suffix="_150px")
        
    else:
        print(f"❌ Fichier non trouvé: {pdf_path}") 