// Données de test pour injecter directement dans le frontend
export const testStructuredData = {
  "personal_information": {
    "name": "Marie Dupont",
    "email": "marie.dupont@email.com",
    "phone": "+33 6 12 34 56 78",
    "address": "15 Avenue des Champs-Élysées, 75008 Paris",
    "linkedin": "linkedin.com/in/mariedupont",
    "website": "mariedupont.dev"
  },
  "education": [
    {
      "institution": "École Centrale Paris",
      "degree": "Master en Informatique",
      "field": "Informatique",
      "location": "Paris, France",
      "start_date": "2019-09",
      "end_date": "2021-06",
      "description": "Spécialisation en Intelligence Artificielle et Machine Learning"
    },
    {
      "institution": "Université Paris-Saclay",
      "degree": "Licence en Mathématiques",
      "field": "Mathématiques",
      "location": "Orsay, France",
      "start_date": "2016-09",
      "end_date": "2019-06",
      "description": "Formation en mathématiques appliquées"
    }
  ],
  "experiences": [
    {
      "title": "Développeuse Full Stack Senior",
      "company": "TechCorp France",
      "location": "Paris, France",
      "start_date": "2022-03",
      "end_date": "Présent",
      "description": "Développement d'applications web complexes avec React, Node.js et Python. Gestion d'équipe de 5 développeurs."
    },
    {
      "title": "Développeuse Frontend",
      "company": "StartupXYZ",
      "location": "Lyon, France",
      "start_date": "2021-07",
      "end_date": "2022-02",
      "description": "Développement d'interfaces utilisateur avec Vue.js et TypeScript"
    }
  ],
  "skills": [
    "JavaScript",
    "TypeScript",
    "React",
    "Vue.js",
    "Node.js",
    "Python",
    "Django",
    "PostgreSQL",
    "MongoDB",
    "Docker",
    "AWS",
    "Git"
  ],
  "complementary_data": {
    "summary": "Développeuse full stack passionnée avec 3 ans d'expérience dans le développement d'applications web modernes. Spécialisée en React et Node.js.",
    "interests": "Intelligence Artificielle, Open Source, Lecture de livres techniques",
    "awards": "Prix du meilleur projet étudiant 2021",
    "publications": "Article sur Medium: 'Les bonnes pratiques React en 2024'",
    "volunteer": "Mentor bénévole pour jeunes développeurs via l'association CodeFirstGirls",
    "certifications": "AWS Certified Developer Associate, Google Cloud Professional Developer",
    "languages": "Français (natif), Anglais (courant), Espagnol (intermédiaire)",
    "projects": "Projet e-commerce React/Node.js avec paiement Stripe, Application de gestion de tâches avec Vue.js",
    "other_info": "Membre actif de la communauté open source, contributeur régulier sur GitHub"
  },
  "raw_content": "Données de test injectées",
  "format": "json_structured"
};

// Fonction pour injecter les données de test
export const injectTestData = () => {
  console.log('🧪 Injection des données de test...');
  console.log('📊 Données injectées:', testStructuredData);
  return testStructuredData;
}; 