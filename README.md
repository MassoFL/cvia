# 🚀 CVIA - CV Analysis and Extraction System

**CVIA** est un système intelligent d'analyse et d'extraction de données de CV utilisant l'IA pour automatiser le processus de recrutement.

## 🎯 **Fonctionnalités principales**

### **📄 Extraction intelligente de CV**
- **OCR avancé** : Extraction précise du texte depuis les PDF
- **IA de pointe** : Utilisation de ChatGPT pour structurer les données
- **Format standardisé** : Sortie JSON cohérente et exploitable

### **🔍 Analyse comparative**
- **Matching intelligent** : Comparaison CV/offre d'emploi
- **Score d'adéquation** : Évaluation quantitative de la compatibilité
- **Recommandations** : Suggestions d'amélioration du CV

### **📊 Interface moderne**
- **Design responsive** : Compatible desktop et mobile
- **Validation interactive** : Édition et correction des données extraites
- **Templates personnalisables** : Mise en forme professionnelle

## 🔧 **Installation et configuration**

### **1. Configuration des clés API**

#### **OpenAI API Key**
```bash
# Dans backend/config.py ou dans un fichier .env
OPENAI_API_KEY = "your_openai_api_key_here"
```

#### **Supabase**
```bash
# Dans backend/config.py ou dans un fichier .env
SUPABASE_URL = "your_supabase_url_here"
SUPABASE_KEY = "your_supabase_key_here"
SUPABASE_BUCKET = "your_bucket_name"
```

### **2. Installation des dépendances**

#### **Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### **Frontend**
```bash
cd cvia
npm install
```

### **3. Base de données**

Exécuter le script SQL dans Supabase :
```sql
-- Voir backend/create_tables.sql
```

### **4. Lancement**

#### **Backend**
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### **Frontend**
```bash
cd cvia
npm start
```

## 📊 **Format des données extraites**

ChatGPT extrait les données dans le format JSON suivant :

```json
{
  "personal_information": {
    "name": "Nom complet",
    "email": "email@example.com",
    "phone": "+33 6 12 34 56 78",
    "address": "Adresse complète",
    "linkedin": "URL LinkedIn"
  },
  "experiences": [
    {
      "title": "Titre du poste",
      "company": "Nom de l'entreprise",
      "location": "Lieu",
      "start_date": "Date de début",
      "end_date": "Date de fin",
      "description": "Description complète"
    }
  ],
  "education": [
    {
      "degree": "Diplôme",
      "institution": "Établissement",
      "location": "Lieu",
      "start_date": "Date de début",
      "end_date": "Date de fin",
      "description": "Description"
    }
  ],
  "skills": [
    "Compétence 1",
    "Compétence 2"
  ],
  "languages": [
    {
      "language": "Français",
      "level": "Natif"
    }
  ],
  "certifications": [
    {
      "name": "Nom de la certification",
      "issuer": "Organisme émetteur",
      "date": "Date d'obtention"
    }
  ],
  "projects": [
    {
      "name": "Nom du projet",
      "description": "Description du projet",
      "technologies": "Technologies utilisées",
      "date": "Date de réalisation"
    }
  ]
}
```

## 🏗️ **Architecture technique**

### **Backend (FastAPI)**
- **FastAPI** : API REST moderne et performante
- **Supabase** : Base de données et authentification
- **OpenAI API** : Intelligence artificielle
- **Pillow** : Traitement d'images
- **PyPDF2** : Manipulation de PDF

### **Frontend (React)**
- **React** : Interface utilisateur moderne
- **CSS Modules** : Styles modulaires
- **Axios** : Communication avec l'API
- **React Router** : Navigation

## 🔐 **Sécurité**

- **Authentification** : Système de connexion sécurisé
- **Validation** : Vérification des données d'entrée
- **CORS** : Configuration sécurisée des requêtes
- **Variables d'environnement** : Protection des clés API

## 📈 **Roadmap**

- [ ] **Interface d'administration** : Gestion des utilisateurs
- [ ] **Analytics** : Statistiques d'utilisation
- [ ] **Export PDF** : Génération de CV formatés
- [ ] **API publique** : Documentation Swagger
- [ ] **Tests automatisés** : Couverture complète

## 🤝 **Contribution**

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 **Licence**

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 **Contact**

- **Développeur** : MassoFL
- **Email** : contact@cvia.com
- **GitHub** : [https://github.com/MassoFL/cvia](https://github.com/MassoFL/cvia)

---

**CVIA** - Révolutionnez votre processus de recrutement avec l'IA ! 🚀 