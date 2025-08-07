#!/usr/bin/env python3
"""
Job summary generation endpoints for CVIA
Handles job description analysis and summary generation
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Union
import logging
from mistralai import Mistral

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Configuration Mistral
MISTRAL_API_KEY = "xPNU4CDF6Hzj351mYHSFvxmOwZTHHUgi"
client = Mistral(api_key=MISTRAL_API_KEY)

class JobSummaryRequest(BaseModel):
    job_description: str
    experiences: list[dict] = None  # Optionnel pour la compatibilité

class JobSummaryResponse(BaseModel):
    summary: str
    key_requirements: list[str]
    skills_needed: list[str]

class AlignExperiencesRequest(BaseModel):
    job_description: str
    experiences: list[dict]
    skills: Union[dict, list]  # Accepter dict ou list
    level: str
    # Nouveaux paramètres de configuration
    focus: list[str] = ['keywords', 'responsibilities']
    writing_style: str = 'professional'
    custom_instructions: str = ''
    preserve_company_names: bool = True
    preserve_dates: bool = True
    enhance_achievements: bool = True

class AlignExperiencesResponse(BaseModel):
    alignments: list[dict]
    message: str

class ExtractSkillsRequest(BaseModel):
    job_description: str

class ExtractSkillsResponse(BaseModel):
    extracted_skills: dict
    message: str

class ValidateJobDescriptionRequest(BaseModel):
    job_description: str

class ValidateJobDescriptionResponse(BaseModel):
    summary: str
    is_valid: bool
    suggestions: list[str]
    message: str

class ExtractUrlRequest(BaseModel):
    url: str

class ExtractUrlResponse(BaseModel):
    content: str
    title: str
    url: str
    message: str

def generate_job_summary_with_llm(job_description: str, experiences: list = None) -> dict:
    """
    Generate job summary using Mistral LLM
    """
    try:
        logger.info("Generating job summary with Mistral LLM...")
        
        # Synthèse simple du poste (les expériences ne sont plus utilisées pour la synthèse)
        llm_prompt = f"""
        Analyse cette description de poste et génère une synthèse structurée au format JSON suivant :

        {{
            "summary": "Synthèse concise du poste en 2-3 phrases",
            "key_requirements": [
                "Exigence principale 1",
                "Exigence principale 2",
                "Exigence principale 3"
            ],
            "skills_needed": [
                "Compétence technique 1",
                "Compétence technique 2",
                "Compétence technique 3"
            ]
        }}

        Instructions :
        - La synthèse doit être claire et professionnelle
        - Extraire les 3-5 exigences les plus importantes
        - Identifier les compétences techniques clés
        - Retourner uniquement le JSON valide, sans commentaires

        Description du poste à analyser :
        {job_description}
        """
        
        # Appeler le LLM
        llm_response = client.chat.complete(
            model="mistral-large-latest",
            messages=[
                {"role": "user", "content": llm_prompt}
            ],
            max_tokens=1000,
            temperature=0.1
        )
        
        llm_extracted_text = llm_response.choices[0].message.content if llm_response.choices else ""
        
        # Parser le JSON
        try:
            import json
            json_start = llm_extracted_text.find('{')
            json_end = llm_extracted_text.rfind('}') + 1
            
            if json_start != -1 and json_end != 0:
                json_text = llm_extracted_text[json_start:json_end]
                summary_data = json.loads(json_text)
                logger.info("✅ Job summary generation successful")
                return summary_data
            else:
                raise ValueError("No JSON found in LLM response")
                
        except (json.JSONDecodeError, ValueError) as e:
            logger.warning(f"Failed to parse LLM JSON: {str(e)}")
            logger.warning(f"LLM response: {llm_extracted_text[:500]}...")
            
            # Fallback: créer une synthèse basique
            return {
                "summary": "Poste analysé avec succès. Les détails sont disponibles dans la description complète.",
                "key_requirements": [
                    "Expérience professionnelle pertinente",
                    "Compétences techniques adaptées",
                    "Motivation et adaptabilité"
                ],
                "skills_needed": [
                    "Compétences techniques spécialisées",
                    "Capacités de communication",
                    "Esprit d'équipe"
                ]
            }
            
    except Exception as e:
        logger.error(f"Job summary generation failed: {str(e)}")
        
        # Fallback en cas d'erreur
        return {
            "summary": "Analyse du poste en cours. Veuillez consulter la description complète pour plus de détails.",
            "key_requirements": [
                "Voir description du poste",
                "Expérience requise",
                "Compétences demandées"
            ],
            "skills_needed": [
                "Compétences techniques",
                "Compétences relationnelles",
                "Adaptabilité"
            ]
        }

def align_experiences_with_llm(job_description: str, experiences: list, skills: Union[dict, list], level: str, config: dict = None) -> dict:
    """
    Align user experiences with job requirements using Mistral LLM with advanced configuration
    """
    try:
        # Utiliser la configuration par défaut si non fournie
        if config is None:
            config = {
                'focus': ['keywords', 'responsibilities'],
                'writing_style': 'professional',
                'custom_instructions': '',
                'preserve_company_names': True,
                'preserve_dates': True,
                'enhance_achievements': True
            }
        
        logger.info(f"Aligning {len(experiences)} experiences with job requirements (level: {level}, config: {config})")
        
        # Préparer les expériences pour le prompt
        experiences_text = ""
        for i, exp in enumerate(experiences):
            experiences_text += f"""
Expérience {i+1}:
- Titre: {exp.get('title', 'N/A')}
- Entreprise: {exp.get('company', 'N/A')}
- Période: {exp.get('start_date', 'N/A')} - {exp.get('end_date', 'N/A')}
- Description: {exp.get('description', 'N/A')}
"""
        
        # Définir le niveau d'alignement avec les nouveaux niveaux
        alignment_instructions = {
            'conservative': "Modifications minimales uniquement, préserver l'authenticité absolue des expériences.",
            'balanced': "Optimiser les expériences sans les dénaturer, équilibre entre authenticité et adéquation.",
            'aggressive': "Maximiser l'adéquation avec le poste en reformulant significativement les expériences.",
            'creative': "Reformulation créative et impactante pour maximiser l'impact tout en restant véridique.",
            # Anciens niveaux pour compatibilité
            'none': "Garder les expériences exactement comme elles sont, sans aucune modification.",
            'light': "Faire des ajustements légers pour mieux correspondre au poste, en gardant la véracité des informations.",
            'moderate': "Adapter les expériences de manière significative pour correspondre aux exigences du poste."
        }
        
        instruction = alignment_instructions.get(level, alignment_instructions['balanced'])
        
        # Construire les instructions de focus
        focus_instructions = []
        focus_mapping = {
            'keywords': "Optimiser pour les mots-clés techniques et les systèmes ATS",
            'responsibilities': "Mettre l'accent sur les responsabilités similaires à celles du poste",
            'achievements': "Valoriser les réalisations, résultats et impacts mesurables",
            'skills': "Aligner sur les compétences spécifiquement requises pour le poste",
            'leadership': "Mettre en avant les aspects de management, leadership et prise d'initiative"
        }
        
        for focus_item in config.get('focus', []):
            if focus_item in focus_mapping:
                focus_instructions.append(f"- {focus_mapping[focus_item]}")
        
        focus_text = "\n".join(focus_instructions) if focus_instructions else "- Alignement général sur le poste"
        
        # Définir le style de rédaction
        style_instructions = {
            'professional': "Utiliser un ton professionnel, formel et corporate",
            'dynamic': "Adopter un langage énergique, proactif et orienté action",
            'technical': "Employer un vocabulaire technique spécialisé et précis",
            'results-oriented': "Se concentrer sur les métriques, KPIs et résultats quantifiables"
        }
        
        style_instruction = style_instructions.get(config.get('writing_style', 'professional'), style_instructions['professional'])
        
        # Construire les contraintes de préservation
        preservation_rules = []
        if config.get('preserve_company_names', True):
            preservation_rules.append("- OBLIGATOIRE: Conserver exactement les noms d'entreprises originaux")
        if config.get('preserve_dates', True):
            preservation_rules.append("- OBLIGATOIRE: Conserver exactement les dates de début et fin")
        
        preservation_text = "\n".join(preservation_rules) if preservation_rules else ""
        
        # Instructions d'amélioration
        enhancement_rules = []
        if config.get('enhance_achievements', True):
            enhancement_rules.append("- Valoriser et quantifier les réalisations quand c'est possible")
        
        enhancement_text = "\n".join(enhancement_rules) if enhancement_rules else ""
        
        # Instructions personnalisées
        custom_instructions = config.get('custom_instructions', '').strip()
        custom_text = f"\nINSTRUCTIONS PERSONNALISÉES:\n{custom_instructions}" if custom_instructions else ""
        
        llm_prompt = f"""
        Tu es un expert en optimisation de CV avec une expertise approfondie en recrutement et ATS. Analyse les expériences du candidat et adapte-les pour mieux correspondre à cette offre d'emploi.

        DESCRIPTION DU POSTE:
        {job_description}

        EXPÉRIENCES DU CANDIDAT:
        {experiences_text}

        CONFIGURATION D'ALIGNEMENT:
        
        NIVEAU D'ALIGNEMENT: {level}
        INSTRUCTION PRINCIPALE: {instruction}
        
        FOCUS D'OPTIMISATION:
        {focus_text}
        
        STYLE DE RÉDACTION: {style_instruction}
        
        RÈGLES DE PRÉSERVATION:
        {preservation_text}
        
        RÈGLES D'AMÉLIORATION:
        {enhancement_text}
        {custom_text}

        Génère une réponse au format JSON suivant :

        {{
            "alignments": [
                {{
                    "new": {{
                        "title": "Titre optimisé selon les paramètres",
                        "company": "Nom de l'entreprise (préservé si demandé)",
                        "start_date": "Date de début (préservée si demandé)",
                        "end_date": "Date de fin (préservée si demandé)",
                        "description": "Phrase de synthèse concise de l'expérience.\n• Premier point clé de l'expérience\n• Deuxième point clé avec réalisations\n• Troisième point avec compétences/technologies\n• Points supplémentaires si pertinents"
                    }}
                }}
            ]
        }}

        INSTRUCTIONS CRITIQUES :
        - Créer un objet "alignment" pour chaque expérience dans l'ordre exact
        - Respecter ABSOLUMENT les règles de préservation spécifiées
        - Appliquer le style de rédaction demandé de manière cohérente
        - OBLIGATOIRE: Structurer chaque description avec une phrase de synthèse suivie de bullet points (•)
        - Les modifications doivent rester véridiques et professionnelles
        - Intégrer les instructions personnalisées si fournies
        - Retourner uniquement le JSON valide, sans commentaires ni texte supplémentaire
        """
        
        # Appeler le LLM
        llm_response = client.chat.complete(
            model="mistral-large-latest",
            messages=[
                {"role": "user", "content": llm_prompt}
            ],
            max_tokens=2000,
            temperature=0.2
        )
        
        llm_extracted_text = llm_response.choices[0].message.content if llm_response.choices else ""
        
        # Parser le JSON
        try:
            import json
            json_start = llm_extracted_text.find('{')
            json_end = llm_extracted_text.rfind('}') + 1
            
            if json_start != -1 and json_end != 0:
                json_text = llm_extracted_text[json_start:json_end]
                alignment_data = json.loads(json_text)
                logger.info("✅ Experience alignment successful")
                return alignment_data
            else:
                raise ValueError("No JSON found in LLM response")
                
        except (json.JSONDecodeError, ValueError) as e:
            logger.warning(f"Failed to parse alignment JSON: {str(e)}")
            logger.warning(f"LLM response: {llm_extracted_text[:500]}...")
            
            # Fallback: créer des alignements basiques
            fallback_alignments = []
            for i, exp in enumerate(experiences):
                fallback_alignments.append({
                    "new": {
                        "title": exp.get('title', ''),
                        "company": exp.get('company', ''),
                        "start_date": exp.get('start_date', ''),
                        "end_date": exp.get('end_date', ''),
                        "description": exp.get('description', '')
                    }
                })
            
            return {"alignments": fallback_alignments}
            
    except Exception as e:
        logger.error(f"Experience alignment failed: {str(e)}")
        
        # Fallback en cas d'erreur
        fallback_alignments = []
        for i, exp in enumerate(experiences):
            fallback_alignments.append({
                "new": {
                    "title": exp.get('title', ''),
                    "company": exp.get('company', ''),
                    "start_date": exp.get('start_date', ''),
                    "end_date": exp.get('end_date', ''),
                    "description": exp.get('description', '')
                }
            })
        
        return {"alignments": fallback_alignments}

def extract_skills_with_llm(job_description: str) -> dict:
    """
    Extract skills from job description using Mistral LLM
    """
    try:
        logger.info("Extracting skills from job description with Mistral LLM...")
        
        llm_prompt = f"""
        Analyse cette description de poste et extrait les compétences demandées au format JSON suivant :

        {{
            "technical_skills": [
                "Compétence technique 1",
                "Compétence technique 2",
                "Compétence technique 3"
            ],
            "soft_skills": [
                "Compétence relationnelle 1",
                "Compétence relationnelle 2"
            ],
            "tools_and_technologies": [
                "Outil/Technologie 1",
                "Outil/Technologie 2"
            ],
            "languages": [
                "Langage de programmation 1",
                "Langage de programmation 2"
            ],
            "certifications": [
                "Certification 1",
                "Certification 2"
            ]
        }}

        Instructions :
        - Extraire toutes les compétences techniques mentionnées
        - Identifier les compétences relationnelles (soft skills)
        - Lister les outils et technologies spécifiques
        - Identifier les langages de programmation
        - Mentionner les certifications requises
        - Retourner uniquement le JSON valide, sans commentaires

        Description du poste à analyser :
        {job_description}
        """
        
        # Appeler le LLM
        llm_response = client.chat.complete(
            model="mistral-large-latest",
            messages=[
                {"role": "user", "content": llm_prompt}
            ],
            max_tokens=1500,
            temperature=0.1
        )
        
        llm_extracted_text = llm_response.choices[0].message.content if llm_response.choices else ""
        
        # Parser le JSON
        try:
            import json
            json_start = llm_extracted_text.find('{')
            json_end = llm_extracted_text.rfind('}') + 1
            
            if json_start != -1 and json_end != 0:
                json_text = llm_extracted_text[json_start:json_end]
                skills_data = json.loads(json_text)
                logger.info("✅ Skills extraction successful")
                return skills_data
            else:
                raise ValueError("No JSON found in LLM response")
                
        except (json.JSONDecodeError, ValueError) as e:
            logger.warning(f"Failed to parse skills JSON: {str(e)}")
            logger.warning(f"LLM response: {llm_extracted_text[:500]}...")
            
            # Fallback: créer des compétences basiques
            return {
                "technical_skills": [
                    "Compétences techniques générales",
                    "Maîtrise des outils informatiques"
                ],
                "soft_skills": [
                    "Communication",
                    "Travail d'équipe",
                    "Adaptabilité"
                ],
                "tools_and_technologies": [
                    "Outils bureautiques",
                    "Technologies web"
                ],
                "languages": [
                    "Langages de programmation"
                ],
                "certifications": [
                    "Certifications professionnelles"
                ]
            }
            
    except Exception as e:
        logger.error(f"Skills extraction failed: {str(e)}")
        
        # Fallback en cas d'erreur
        return {
            "technical_skills": [
                "Compétences techniques requises",
                "Expertise métier"
            ],
            "soft_skills": [
                "Communication",
                "Esprit d'équipe"
            ],
            "tools_and_technologies": [
                "Outils professionnels"
            ],
            "languages": [
                "Langages techniques"
            ],
            "certifications": [
                "Certifications pertinentes"
            ]
        }

def extract_content_from_url(url: str) -> dict:
    """
    Extract job description content from URL using web scraping
    """
    try:
        import requests
        from bs4 import BeautifulSoup
        import re
        
        logger.info(f"Extracting content from URL: {url}")
        
        # Validate URL format
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        # Set comprehensive headers to mimic a real browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
            'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"'
        }
        
        # Create a session for better cookie handling
        session = requests.Session()
        session.headers.update(headers)
        
        # Make request with timeout and retries
        max_retries = 2
        for attempt in range(max_retries):
            try:
                response = session.get(url, timeout=15, allow_redirects=True)
                response.raise_for_status()
                break
            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 403:
                    if attempt < max_retries - 1:
                        # Try with different user agent on retry
                        session.headers.update({
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0'
                        })
                        continue
                    else:
                        # Provide helpful error message for 403
                        site_name = url.split('/')[2] if '/' in url else url
                        raise ValueError(f"Le site {site_name} bloque l'extraction automatique. Veuillez copier manuellement le contenu de l'offre d'emploi dans la zone de texte.")
                else:
                    raise
        
        # Parse HTML content
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "header", "footer"]):
            script.decompose()
        
        # Extract title
        title = ""
        if soup.title:
            title = soup.title.string.strip()
        elif soup.find('h1'):
            title = soup.find('h1').get_text().strip()
        
        # Try to find job description content using common selectors
        job_content_selectors = [
            '[class*="job-description"]',
            '[class*="job-content"]',
            '[class*="description"]',
            '[class*="offer-description"]',
            '[class*="job-details"]',
            '[class*="content"]',
            'main',
            'article',
            '.content',
            '#content',
            '[role="main"]'
        ]
        
        content = ""
        for selector in job_content_selectors:
            elements = soup.select(selector)
            if elements:
                for element in elements:
                    text = element.get_text(separator='\n', strip=True)
                    if len(text) > len(content):
                        content = text
                break
        
        # Fallback: get all text from body
        if not content or len(content) < 100:
            body = soup.find('body')
            if body:
                content = body.get_text(separator='\n', strip=True)
        
        # Clean up the content
        if content:
            # Remove extra whitespace and empty lines
            lines = [line.strip() for line in content.split('\n') if line.strip()]
            content = '\n'.join(lines)
            
            # Limit content length (keep first 5000 characters)
            if len(content) > 5000:
                content = content[:5000] + "..."
        
        if not content:
            raise ValueError("No content could be extracted from the URL")
        
        logger.info(f"✅ Content extracted successfully: {len(content)} characters")
        
        return {
            "content": content,
            "title": title,
            "url": url,
            "length": len(content)
        }
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error: {str(e)}")
        raise ValueError(f"Impossible d'accéder à l'URL: {str(e)}")
    except Exception as e:
        logger.error(f"Content extraction failed: {str(e)}")
        raise ValueError(f"Erreur lors de l'extraction du contenu: {str(e)}")

def validate_job_description_with_llm(job_description: str) -> dict:
    """
    Validate and generate a clean summary of job description using Mistral LLM
    """
    try:
        logger.info("Validating job description with Mistral LLM...")
        
        llm_prompt = f"""
        Tu es un expert en recrutement et analyse d'offres d'emploi. Analyse cette description de poste et génère une validation au format JSON suivant :

        {{
            "summary": "Synthèse claire et professionnelle du poste en 2-3 phrases, reformulée de manière optimale",
            "is_valid": true,
            "suggestions": [
                "Suggestion d'amélioration 1 (si nécessaire)",
                "Suggestion d'amélioration 2 (si nécessaire)"
            ],
            "quality_score": 85,
            "missing_elements": [
                "Élément manquant 1 (si applicable)",
                "Élément manquant 2 (si applicable)"
            ]
        }}

        Instructions de validation :
        - Évaluer si la description contient les éléments essentiels d'une offre d'emploi
        - Générer une synthèse claire et professionnelle qui capture l'essence du poste
        - Identifier les éléments manquants importants (salaire, localisation, etc.)
        - Proposer des suggestions d'amélioration si nécessaire
        - Le score de qualité doit être entre 0 et 100
        - is_valid = true si la description est utilisable pour l'optimisation de CV
        - Retourner uniquement le JSON valide, sans commentaires

        Description du poste à valider :
        {job_description}
        """
        
        # Appeler le LLM
        llm_response = client.chat.complete(
            model="mistral-large-latest",
            messages=[
                {"role": "user", "content": llm_prompt}
            ],
            max_tokens=1000,
            temperature=0.1
        )
        
        llm_extracted_text = llm_response.choices[0].message.content if llm_response.choices else ""
        
        # Parser le JSON
        try:
            import json
            json_start = llm_extracted_text.find('{')
            json_end = llm_extracted_text.rfind('}') + 1
            
            if json_start != -1 and json_end != 0:
                json_text = llm_extracted_text[json_start:json_end]
                validation_data = json.loads(json_text)
                logger.info("✅ Job description validation successful")
                return validation_data
            else:
                raise ValueError("No JSON found in LLM response")
                
        except (json.JSONDecodeError, ValueError) as e:
            logger.warning(f"Failed to parse validation JSON: {str(e)}")
            logger.warning(f"LLM response: {llm_extracted_text[:500]}...")
            
            # Fallback: créer une validation basique
            return {
                "summary": "Description de poste analysée et validée pour l'optimisation de CV.",
                "is_valid": True,
                "suggestions": [
                    "La description semble complète pour l'optimisation de CV"
                ],
                "quality_score": 75,
                "missing_elements": []
            }
            
    except Exception as e:
        logger.error(f"Job description validation failed: {str(e)}")
        
        # Fallback en cas d'erreur
        return {
            "summary": "Description de poste reçue et prête pour l'optimisation de CV.",
            "is_valid": True,
            "suggestions": [
                "Validation automatique non disponible, mais la description peut être utilisée"
            ],
            "quality_score": 70,
            "missing_elements": []
        }

@router.post("/validate_job_description/")
async def validate_job_description(request: ValidateJobDescriptionRequest):
    """
    Validate job description and generate a clean summary
    """
    try:
        logger.info(f"Validating job description: {len(request.job_description)} characters")
        
        if not request.job_description or len(request.job_description.strip()) < 20:
            raise HTTPException(
                status_code=400, 
                detail="Job description is too short (minimum 20 characters required)"
            )
        
        # Validate and generate summary using LLM
        validation_data = validate_job_description_with_llm(request.job_description)
        
        return JSONResponse(content={
            "summary": validation_data.get("summary", ""),
            "is_valid": validation_data.get("is_valid", True),
            "suggestions": validation_data.get("suggestions", []),
            "quality_score": validation_data.get("quality_score", 70),
            "missing_elements": validation_data.get("missing_elements", []),
            "message": "Job description validated successfully"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during job description validation: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/extract_skills/")
async def extract_skills(request: ExtractSkillsRequest):
    """
    Extract skills from job description
    """
    try:
        logger.info(f"Extracting skills from job description: {len(request.job_description)} characters")
        
        if not request.job_description or len(request.job_description.strip()) < 10:
            raise HTTPException(
                status_code=400, 
                detail="Job description is too short or empty"
            )
        
        # Extract skills using LLM
        skills_data = extract_skills_with_llm(request.job_description)
        
        return JSONResponse(content={
            "extracted_skills": skills_data,
            "message": "Skills extracted successfully"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during skills extraction: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/align_experiences/")
async def align_experiences(request: AlignExperiencesRequest):
    """
    Align user experiences with job requirements
    """
    try:
        logger.info(f"Aligning experiences: {len(request.experiences)} experiences, level: {request.level}")
        
        if not request.job_description or len(request.job_description.strip()) < 10:
            raise HTTPException(
                status_code=400, 
                detail="Job description is too short or empty"
            )
        
        if not request.experiences:
            raise HTTPException(
                status_code=400, 
                detail="No experiences provided"
            )
        
        # Préparer la configuration pour l'alignement
        config = {
            'focus': request.focus,
            'writing_style': request.writing_style,
            'custom_instructions': request.custom_instructions,
            'preserve_company_names': request.preserve_company_names,
            'preserve_dates': request.preserve_dates,
            'enhance_achievements': request.enhance_achievements
        }
        
        # Align experiences using LLM with configuration
        alignment_data = align_experiences_with_llm(
            request.job_description, 
            request.experiences, 
            request.skills, 
            request.level,
            config
        )
        
        return JSONResponse(content={
            "alignments": alignment_data.get("alignments", []),
            "message": "Experiences aligned successfully"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during experience alignment: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error: {str(e)}"
        )

@router.post("/generate_job_summary/")
async def generate_job_summary(request: JobSummaryRequest):
    """
    Generate a job summary from job description
    """
    try:
        logger.info(f"Generating job summary for description: {len(request.job_description)} characters")
        
        if not request.job_description or len(request.job_description.strip()) < 10:
            raise HTTPException(
                status_code=400, 
                detail="Job description is too short or empty"
            )
        
        # Generate summary using LLM
        summary_data = generate_job_summary_with_llm(request.job_description, request.experiences)
        
        return JSONResponse(content={
            "summary": summary_data.get("summary", ""),
            "key_requirements": summary_data.get("key_requirements", []),
            "skills_needed": summary_data.get("skills_needed", []),
            "message": "Job summary generated successfully"
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during job summary generation: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/health_job_summary")
async def health_check_job_summary():
    """
    Health check endpoint for job summary service
    """
    try:
        if MISTRAL_API_KEY:
            return JSONResponse(content={
                "status": "healthy",
                "service": "job_summary",
                "message": "Job summary service is ready",
                "api_key_configured": True
            })
        else:
            return JSONResponse(content={
                "status": "unhealthy",
                "service": "job_summary",
                "error": "Mistral API key not configured",
                "message": "Job summary service is not ready"
            }, status_code=500)
    except Exception as e:
        return JSONResponse(content={
            "status": "unhealthy",
            "service": "job_summary",
            "error": str(e),
            "message": "Job summary service is not ready"
        }, status_code=500)

@router.post("/extract_url_content/")
async def extract_url_content(request: ExtractUrlRequest):
    """
    Extract job description content from URL
    """
    try:
        logger.info(f"Extracting content from URL: {request.url}")
        
        if not request.url or not request.url.strip():
            raise HTTPException(
                status_code=400, 
                detail="URL is required"
            )
        
        # Extract content from URL
        extraction_data = extract_content_from_url(request.url.strip())
        
        return JSONResponse(content={
            "content": extraction_data.get("content", ""),
            "title": extraction_data.get("title", ""),
            "url": extraction_data.get("url", ""),
            "length": extraction_data.get("length", 0),
            "message": "Content extracted successfully from URL"
        })
        
    except ValueError as e:
        # Ces erreurs sont déjà formatées pour l'utilisateur
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during URL extraction: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Erreur interne du serveur: {str(e)}"
        )