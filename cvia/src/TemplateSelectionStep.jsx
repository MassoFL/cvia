import React, { useState } from 'react';
import { ProgressSteps } from './FrontPage';

// Composants d'aperçu pour chaque template
const ModernPreview = () => (
  <div style={{
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
    padding: 20,
    color: '#fff',
    fontSize: 9,
    lineHeight: 1.3,
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* En-tête moderne */}
    <div style={{
      borderBottom: `2px solid ${GREEN}`,
      paddingBottom: 15,
      marginBottom: 20
    }}>
      <div style={{ fontSize: 18, fontWeight: 'bold', color: GREEN, marginBottom: 6 }}>
        JEAN DUPONT
      </div>
      <div style={{ fontSize: 11, color: '#ccc', marginBottom: 4 }}>
        Product Owner • jean.dupont@email.com • +33 6 12 34 56 78
      </div>
      <div style={{ fontSize: 10, color: '#aaa' }}>
        Paris, France • linkedin.com/in/jeandupont
      </div>
    </div>
    
    {/* Section synthèse */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: GREEN, marginBottom: 8 }}>
        SYNTHÈSE DU MATCH
      </div>
      <div style={{ fontSize: 9, color: '#ddd', lineHeight: 1.4 }}>
        Poste de Product Owner pour plateforme data, vous avez une expérience en gestion de projet. 
        Vos expériences s'alignent bien avec les responsabilités de backlog et roadmap produit. 
        Vos points forts sont la collaboration avec équipes techniques et parties prenantes.
      </div>
    </div>
    
    {/* Expériences */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: GREEN, marginBottom: 10 }}>
        EXPÉRIENCES PROFESSIONNELLES
      </div>
      
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 'bold', color: '#fff' }}>
            Product Owner
          </div>
          <div style={{ fontSize: 9, color: '#aaa' }}>
            2022 - 2024
          </div>
        </div>
        <div style={{ fontSize: 10, color: GREEN, marginBottom: 4 }}>
          TechCorp • Paris, France
        </div>
        <div style={{ fontSize: 9, color: '#ddd', lineHeight: 1.4 }}>
          • Gestion de backlog produit et roadmap stratégique<br/>
          • Collaboration avec équipes techniques et parties prenantes<br/>
          • Analyse de données et mesure de performance produit<br/>
          • Pilotage de projets Agile/Scrum avec 8 développeurs
        </div>
      </div>
      
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 'bold', color: '#fff' }}>
            Chef de Projet Digital
          </div>
          <div style={{ fontSize: 9, color: '#aaa' }}>
            2020 - 2022
          </div>
        </div>
        <div style={{ fontSize: 10, color: GREEN, marginBottom: 4 }}>
          DigitalAgency • Lyon, France
        </div>
        <div style={{ fontSize: 9, color: '#ddd', lineHeight: 1.4 }}>
          • Gestion de projets web et applications mobiles<br/>
          • Coordination entre équipes design, développement et marketing<br/>
          • Suivi budgétaire et planning de projets
        </div>
      </div>
    </div>
    
    {/* Compétences */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: GREEN, marginBottom: 8 }}>
        COMPÉTENCES CLÉS
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {['Agile', 'Scrum', 'Product Management', 'Jira', 'Confluence', 'Data Analysis', 'Stakeholder Management', 'User Stories', 'Roadmap Planning'].map(skill => (
          <span key={skill} style={{ 
            background: GREEN, 
            color: '#000', 
            padding: '3px 8px', 
            borderRadius: 4, 
            fontSize: 8,
            fontWeight: 'bold'
          }}>
            {skill}
          </span>
        ))}
      </div>
    </div>
    
    {/* Formation */}
    <div>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: GREEN, marginBottom: 8 }}>
        FORMATION
      </div>
      <div style={{ fontSize: 9, color: '#ddd' }}>
        <strong>Master en Management de Projet</strong> - École de Commerce (2018-2020)<br/>
        <strong>Certification Scrum Master</strong> - Scrum Alliance (2021)<br/>
        <strong>Certification Product Owner</strong> - Scrum.org (2022)
      </div>
    </div>
  </div>
);

const ClassicPreview = () => (
  <div style={{
    width: '100%',
    height: '100%',
    background: '#fff',
    padding: 20,
    color: '#333',
    fontSize: 9,
    lineHeight: 1.3,
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* En-tête classique */}
    <div style={{
      textAlign: 'center',
      borderBottom: '2px solid #4a90e2',
      paddingBottom: 15,
      marginBottom: 20
    }}>
      <div style={{ fontSize: 20, fontWeight: 'bold', color: '#4a90e2', marginBottom: 6 }}>
        JEAN DUPONT
      </div>
      <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>
        Product Owner • jean.dupont@email.com • +33 6 12 34 56 78
      </div>
      <div style={{ fontSize: 10, color: '#888' }}>
        Paris, France • linkedin.com/in/jeandupont
      </div>
    </div>
    
    {/* Section profil */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#4a90e2', marginBottom: 8, textTransform: 'uppercase' }}>
        Profil Professionnel
      </div>
      <div style={{ fontSize: 9, color: '#333', lineHeight: 1.4 }}>
        Product Owner expérimenté avec 5 ans d'expérience dans la gestion de produits digitaux. 
        Spécialisé dans les méthodologies Agile et Scrum, avec une expertise en analyse de données 
        et en collaboration avec des équipes pluridisciplinaires.
      </div>
    </div>
    
    {/* Expérience */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#4a90e2', marginBottom: 10, textTransform: 'uppercase' }}>
        Expérience Professionnelle
      </div>
      
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 'bold', color: '#333' }}>
            Product Owner
          </div>
          <div style={{ fontSize: 9, color: '#666' }}>
            2022 - 2024
          </div>
        </div>
        <div style={{ fontSize: 10, color: '#4a90e2', marginBottom: 4, fontStyle: 'italic' }}>
          TechCorp • Paris, France
        </div>
        <div style={{ fontSize: 9, color: '#333', lineHeight: 1.4 }}>
          • Gestion de backlog produit et roadmap stratégique<br/>
          • Collaboration avec équipes techniques et parties prenantes<br/>
          • Analyse de données et mesure de performance produit<br/>
          • Pilotage de projets Agile/Scrum avec 8 développeurs
        </div>
      </div>
      
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 'bold', color: '#333' }}>
            Chef de Projet Digital
          </div>
          <div style={{ fontSize: 9, color: '#666' }}>
            2020 - 2022
          </div>
        </div>
        <div style={{ fontSize: 10, color: '#4a90e2', marginBottom: 4, fontStyle: 'italic' }}>
          DigitalAgency • Lyon, France
        </div>
        <div style={{ fontSize: 9, color: '#333', lineHeight: 1.4 }}>
          • Gestion de projets web et applications mobiles<br/>
          • Coordination entre équipes design, développement et marketing<br/>
          • Suivi budgétaire et planning de projets
        </div>
      </div>
    </div>
    
    {/* Compétences */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#4a90e2', marginBottom: 8, textTransform: 'uppercase' }}>
        Compétences
      </div>
      <div style={{ fontSize: 9, color: '#333', lineHeight: 1.4 }}>
        <strong>Méthodologies:</strong> Agile, Scrum, Kanban, Lean<br/>
        <strong>Outils:</strong> Jira, Confluence, Figma, Miro, Trello<br/>
        <strong>Technologies:</strong> SQL, Python, API, Data Analysis<br/>
        <strong>Soft Skills:</strong> Leadership, Communication, Stakeholder Management
      </div>
    </div>
    
    {/* Formation */}
    <div>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#4a90e2', marginBottom: 8, textTransform: 'uppercase' }}>
        Formation
      </div>
      <div style={{ fontSize: 9, color: '#333' }}>
        <strong>Master en Management de Projet</strong> - École de Commerce (2018-2020)<br/>
        <strong>Certification Scrum Master</strong> - Scrum Alliance (2021)<br/>
        <strong>Certification Product Owner</strong> - Scrum.org (2022)
      </div>
    </div>
  </div>
);

const CreativePreview = () => (
  <div style={{
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #2d1b69, #11998e)',
    padding: 20,
    color: '#fff',
    fontSize: 9,
    lineHeight: 1.3,
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* En-tête créatif */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20
    }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 'bold', color: '#ff6b6b', marginBottom: 4 }}>
          JEAN DUPONT
        </div>
        <div style={{ fontSize: 10, color: '#ddd', marginBottom: 2 }}>
          Product Owner
        </div>
        <div style={{ fontSize: 9, color: '#aaa' }}>
          jean.dupont@email.com • +33 6 12 34 56 78
        </div>
      </div>
      <div style={{
        width: 50,
        height: 50,
        borderRadius: '50%',
        background: '#ff6b6b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        boxShadow: '0 4px 12px rgba(255,107,107,0.3)'
      }}>
        JD
      </div>
    </div>
    
    {/* Score de compatibilité */}
    <div style={{
      background: 'rgba(255,255,255,0.1)',
      borderRadius: 8,
      padding: 12,
      marginBottom: 20,
      textAlign: 'center',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ fontSize: 9, color: '#ddd', marginBottom: 4 }}>
        Score de compatibilité avec le poste
      </div>
      <div style={{ fontSize: 20, fontWeight: 'bold', color: '#ff6b6b' }}>
        95%
      </div>
      <div style={{ fontSize: 8, color: '#aaa', marginTop: 2 }}>
        Excellent match avec les exigences
      </div>
    </div>
    
    {/* Expériences avec graphiques */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#ff6b6b', marginBottom: 10 }}>
        EXPÉRIENCES CLÉS
      </div>
      
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ width: 40, height: 6, background: '#ff6b6b', borderRadius: 3, marginRight: 10 }}></div>
          <div style={{ fontSize: 11, fontWeight: 'bold', color: '#fff' }}>
            Product Owner - TechCorp
          </div>
        </div>
        <div style={{ fontSize: 9, color: '#aaa', marginLeft: 50, marginBottom: 4 }}>
          2022 - 2024
        </div>
        <div style={{ fontSize: 8, color: '#ddd', marginLeft: 50, lineHeight: 1.4 }}>
          • Gestion de backlog produit et roadmap stratégique<br/>
          • Collaboration avec équipes techniques
        </div>
      </div>
      
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ width: 30, height: 6, background: '#ff6b6b', borderRadius: 3, marginRight: 10 }}></div>
          <div style={{ fontSize: 11, fontWeight: 'bold', color: '#fff' }}>
            Chef de Projet Digital - DigitalAgency
          </div>
        </div>
        <div style={{ fontSize: 9, color: '#aaa', marginLeft: 50, marginBottom: 4 }}>
          2020 - 2022
        </div>
        <div style={{ fontSize: 8, color: '#ddd', marginLeft: 50, lineHeight: 1.4 }}>
          • Gestion de projets web et applications mobiles<br/>
          • Coordination entre équipes pluridisciplinaires
        </div>
      </div>
    </div>
    
    {/* Compétences créatives */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#ff6b6b', marginBottom: 8 }}>
        COMPÉTENCES PRINCIPALES
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {['Agile', 'Scrum', 'Product Management', 'Jira', 'Data Analysis', 'Stakeholder Management'].map(skill => (
          <div key={skill} style={{
            background: '#ff6b6b',
            color: '#fff',
            padding: '3px 8px',
            borderRadius: 12,
            fontSize: 8,
            fontWeight: 'bold',
            boxShadow: '0 2px 6px rgba(255,107,107,0.3)'
          }}>
            {skill}
          </div>
        ))}
      </div>
    </div>
    
    {/* Formation */}
    <div>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#ff6b6b', marginBottom: 8 }}>
        FORMATION
      </div>
      <div style={{ fontSize: 9, color: '#ddd', lineHeight: 1.4 }}>
        <strong>Master en Management de Projet</strong> - École de Commerce (2018-2020)<br/>
        <strong>Certification Scrum Master</strong> - Scrum Alliance (2021)<br/>
        <strong>Certification Product Owner</strong> - Scrum.org (2022)
      </div>
    </div>
  </div>
);

const ATSPreview = () => (
  <div style={{
    width: '100%',
    height: '100%',
    background: '#fff',
    padding: 20,
    color: '#333',
    fontSize: 9,
    lineHeight: 1.3,
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* En-tête ATS */}
    <div style={{
      borderBottom: '1px solid #333',
      paddingBottom: 12,
      marginBottom: 20
    }}>
      <div style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 }}>
        JEAN DUPONT
      </div>
      <div style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>
        Product Owner | jean.dupont@email.com | +33 6 12 34 56 78
      </div>
      <div style={{ fontSize: 9, color: '#888' }}>
        Paris, France | linkedin.com/in/jeandupont
      </div>
    </div>
    
    {/* Résumé */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 8, textTransform: 'uppercase' }}>
        Résumé Professionnel
      </div>
      <div style={{ fontSize: 9, color: '#333', lineHeight: 1.4 }}>
        Product Owner expérimenté avec 5 ans d'expérience en gestion de produits digitaux, 
        spécialisé en méthodologies Agile et Scrum. Expertise en analyse de données, 
        gestion de backlog produit et collaboration avec des équipes pluridisciplinaires.
      </div>
    </div>
    
    {/* Expérience */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 10, textTransform: 'uppercase' }}>
        Expérience Professionnelle
      </div>
      
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 'bold', color: '#333' }}>
            Product Owner
          </div>
          <div style={{ fontSize: 9, color: '#666' }}>
            2022 - 2024
          </div>
        </div>
        <div style={{ fontSize: 10, color: '#333', marginBottom: 4, fontStyle: 'italic' }}>
          TechCorp, Paris, France
        </div>
        <div style={{ fontSize: 9, color: '#333', lineHeight: 1.4 }}>
          • Gestion de backlog produit et roadmap stratégique<br/>
          • Collaboration avec équipes techniques et parties prenantes<br/>
          • Analyse de données et mesure de performance produit<br/>
          • Pilotage de projets Agile/Scrum avec 8 développeurs<br/>
          • Définition et priorisation des user stories
        </div>
      </div>
      
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 'bold', color: '#333' }}>
            Chef de Projet Digital
          </div>
          <div style={{ fontSize: 9, color: '#666' }}>
            2020 - 2022
          </div>
        </div>
        <div style={{ fontSize: 10, color: '#333', marginBottom: 4, fontStyle: 'italic' }}>
          DigitalAgency, Lyon, France
        </div>
        <div style={{ fontSize: 9, color: '#333', lineHeight: 1.4 }}>
          • Gestion de projets web et applications mobiles<br/>
          • Coordination entre équipes design, développement et marketing<br/>
          • Suivi budgétaire et planning de projets<br/>
          • Gestion des risques et résolution de problèmes
        </div>
      </div>
    </div>
    
    {/* Compétences */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 8, textTransform: 'uppercase' }}>
        Compétences Techniques
      </div>
      <div style={{ fontSize: 9, color: '#333', lineHeight: 1.4 }}>
        <strong>Méthodologies:</strong> Agile, Scrum, Kanban, Lean, Waterfall<br/>
        <strong>Outils:</strong> Jira, Confluence, Figma, Miro, Trello, Asana<br/>
        <strong>Technologies:</strong> SQL, Python, API, Data Analysis, REST APIs<br/>
        <strong>Soft Skills:</strong> Leadership, Communication, Stakeholder Management, Problem Solving
      </div>
    </div>
    
    {/* Formation */}
    <div>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 8, textTransform: 'uppercase' }}>
        Formation
      </div>
      <div style={{ fontSize: 9, color: '#333', lineHeight: 1.4 }}>
        <strong>Master en Management de Projet</strong> - École de Commerce (2018-2020)<br/>
        <strong>Certification Scrum Master</strong> - Scrum Alliance (2021)<br/>
        <strong>Certification Product Owner</strong> - Scrum.org (2022)<br/>
        <strong>Certification Agile Project Management</strong> - PMI (2023)
      </div>
    </div>
  </div>
);

// Composants de prévisualisation avec vraies données utilisateur
const ModernPreviewWithData = ({ userData, jobSummary }) => (
  <div style={{
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
    padding: 20,
    color: '#fff',
    fontSize: 9,
    lineHeight: 1.3,
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* En-tête moderne */}
    <div style={{
      borderBottom: `2px solid ${GREEN}`,
      paddingBottom: 15,
      marginBottom: 20
    }}>
      <div style={{ fontSize: 18, fontWeight: 'bold', color: GREEN, marginBottom: 6 }}>
        {userData?.name?.toUpperCase() || 'NOM PRÉNOM'}
      </div>
      <div style={{ fontSize: 11, color: '#ccc', marginBottom: 4 }}>
        {userData?.title || 'Poste'} • {userData?.email || 'email@example.com'} • {userData?.phone || '+33 6 12 34 56 78'}
      </div>
      <div style={{ fontSize: 10, color: '#aaa' }}>
        {userData?.location || 'Ville, Pays'} • {userData?.linkedin || 'linkedin.com/in/profile'}
      </div>
    </div>
    

    
    {/* Expériences */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: GREEN, marginBottom: 10 }}>
        EXPÉRIENCES PROFESSIONNELLES
      </div>
      
      {Array.isArray(userData?.experiences) && userData.experiences.map((exp, index) => (
        <div key={index} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: '#fff' }}>
              {exp.title}
            </div>
            <div style={{ fontSize: 9, color: '#aaa' }}>
              {exp.startDate} - {exp.endDate}
            </div>
          </div>
          <div style={{ fontSize: 10, color: GREEN, marginBottom: 4 }}>
            {exp.company} • {exp.location}
          </div>
          <div style={{ fontSize: 9, color: '#ddd', lineHeight: 1.4 }}>
            {(exp.alignedDescription || exp.description).split('•').map((bullet, bulletIndex) => (
              bullet.trim() && (
                <div key={bulletIndex} style={{ marginBottom: 2 }}>
                  • {bullet.trim()}
                </div>
              )
            ))}
          </div>
        </div>
      ))}
    </div>
    
    {/* Compétences */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: GREEN, marginBottom: 8 }}>
        COMPÉTENCES CLÉS
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {Array.isArray(userData?.skills) && userData.skills.map((skill, index) => (
          <span key={index} style={{ 
            background: GREEN, 
            color: '#000', 
            padding: '3px 8px', 
            borderRadius: 4, 
            fontSize: 8,
            fontWeight: 'bold'
          }}>
            {skill}
          </span>
        ))}
      </div>
    </div>
    
    {/* Formation */}
    <div>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: GREEN, marginBottom: 8 }}>
        FORMATION
      </div>
      <div style={{ fontSize: 9, color: '#ddd' }}>
        {Array.isArray(userData?.education) && userData.education.map((edu, index) => (
          <div key={index}>
            <strong>{edu.degree}</strong> - {edu.school} ({edu.year})
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ClassicPreviewWithData = ({ userData, jobSummary }) => (
  <div style={{
    width: '100%',
    height: '100%',
    background: '#fff',
    padding: 20,
    color: '#333',
    fontSize: 9,
    lineHeight: 1.3,
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* En-tête classique */}
    <div style={{
      textAlign: 'center',
      borderBottom: '2px solid #4a90e2',
      paddingBottom: 15,
      marginBottom: 20
    }}>
      <div style={{ fontSize: 20, fontWeight: 'bold', color: '#4a90e2', marginBottom: 6 }}>
        {userData?.name?.toUpperCase() || 'NOM PRÉNOM'}
      </div>
      <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>
        {userData?.title || 'Poste'} • {userData?.email || 'email@example.com'} • {userData?.phone || '+33 6 12 34 56 78'}
      </div>
      <div style={{ fontSize: 10, color: '#888' }}>
        {userData?.location || 'Ville, Pays'} • {userData?.linkedin || 'linkedin.com/in/profile'}
      </div>
    </div>
    
    {/* Section profil */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#4a90e2', marginBottom: 8, textTransform: 'uppercase' }}>
        Profil Professionnel
      </div>
      <div style={{ fontSize: 9, color: '#333', lineHeight: 1.4 }}>
        {userData?.summary || 'Résumé professionnel...'}
      </div>
    </div>
    
    {/* Expérience */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#4a90e2', marginBottom: 10, textTransform: 'uppercase' }}>
        Expérience Professionnelle
      </div>
      
      {Array.isArray(userData?.experiences) && userData.experiences.map((exp, index) => (
        <div key={index} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: '#333' }}>
              {exp.title}
            </div>
            <div style={{ fontSize: 9, color: '#666' }}>
              {exp.startDate} - {exp.endDate}
            </div>
          </div>
          <div style={{ fontSize: 10, color: '#4a90e2', marginBottom: 4, fontStyle: 'italic' }}>
            {exp.company} • {exp.location}
          </div>
          <div style={{ fontSize: 9, color: '#333', lineHeight: 1.4 }}>
            {(exp.alignedDescription || exp.description).split('•').map((bullet, bulletIndex) => (
              bullet.trim() && (
                <div key={bulletIndex} style={{ marginBottom: 2 }}>
                  • {bullet.trim()}
                </div>
              )
            ))}
          </div>
        </div>
      ))}
    </div>
    
    {/* Compétences */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#4a90e2', marginBottom: 8, textTransform: 'uppercase' }}>
        Compétences
      </div>
      <div style={{ fontSize: 9, color: '#333', lineHeight: 1.4 }}>
        {Array.isArray(userData?.skills) && userData.skills.map((skill, index) => (
          <span key={index} style={{ marginRight: 8 }}>
            <strong>{skill}</strong>
            {index < userData.skills.length - 1 ? ',' : ''}
          </span>
        ))}
      </div>
    </div>
    
    {/* Formation */}
    <div>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#4a90e2', marginBottom: 8, textTransform: 'uppercase' }}>
        Formation
      </div>
      <div style={{ fontSize: 9, color: '#333' }}>
        {Array.isArray(userData?.education) && userData.education.map((edu, index) => (
          <div key={index}>
            <strong>{edu.degree}</strong> - {edu.school} ({edu.year})
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CreativePreviewWithData = ({ userData, jobSummary }) => (
  <div style={{
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #2d1b69, #11998e)',
    padding: 20,
    color: '#fff',
    fontSize: 9,
    lineHeight: 1.3,
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* En-tête créatif */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20
    }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 'bold', color: '#ff6b6b', marginBottom: 4 }}>
          {userData?.name?.toUpperCase() || 'NOM PRÉNOM'}
        </div>
        <div style={{ fontSize: 10, color: '#ddd', marginBottom: 2 }}>
          {userData?.title || 'Poste'}
        </div>
        <div style={{ fontSize: 9, color: '#aaa' }}>
          {userData?.email || 'email@example.com'} • {userData?.phone || '+33 6 12 34 56 78'}
        </div>
      </div>
      <div style={{
        width: 50,
        height: 50,
        borderRadius: '50%',
        background: '#ff6b6b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        boxShadow: '0 4px 12px rgba(255,107,107,0.3)'
      }}>
        {userData?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NP'}
      </div>
    </div>
    

    
    {/* Expériences avec graphiques */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#ff6b6b', marginBottom: 10 }}>
        EXPÉRIENCES CLÉS
      </div>
      
      {Array.isArray(userData?.experiences) && userData.experiences.map((exp, index) => (
        <div key={index} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
            <div style={{ 
              width: 40 - (index * 5), 
              height: 6, 
              background: '#ff6b6b', 
              borderRadius: 3, 
              marginRight: 10 
            }}></div>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: '#fff' }}>
              {exp.title} - {exp.company}
            </div>
          </div>
          <div style={{ fontSize: 9, color: '#aaa', marginLeft: 50, marginBottom: 4 }}>
            {exp.startDate} - {exp.endDate}
          </div>
          <div style={{ fontSize: 8, color: '#ddd', marginLeft: 50, lineHeight: 1.4 }}>
            {(exp.alignedDescription || exp.description).split('•').map((bullet, bulletIndex) => (
              bullet.trim() && (
                <div key={bulletIndex} style={{ marginBottom: 2 }}>
                  • {bullet.trim()}
                </div>
              )
            ))}
          </div>
        </div>
      ))}
    </div>
    
    {/* Compétences créatives */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#ff6b6b', marginBottom: 8 }}>
        COMPÉTENCES PRINCIPALES
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {Array.isArray(userData?.skills) && userData.skills.map((skill, index) => (
          <div key={index} style={{
            background: '#ff6b6b',
            color: '#fff',
            padding: '3px 8px',
            borderRadius: 12,
            fontSize: 8,
            fontWeight: 'bold',
            boxShadow: '0 2px 6px rgba(255,107,107,0.3)'
          }}>
            {skill}
          </div>
        ))}
      </div>
    </div>
    
    {/* Formation */}
    <div>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#ff6b6b', marginBottom: 8 }}>
        FORMATION
      </div>
      <div style={{ fontSize: 9, color: '#ddd', lineHeight: 1.4 }}>
        {Array.isArray(userData?.education) && userData.education.map((edu, index) => (
          <div key={index}>
            <strong>{edu.degree}</strong> - {edu.school} ({edu.year})
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ATSPreviewWithData = ({ userData, jobSummary }) => (
  <div style={{
    width: '100%',
    height: '100%',
    background: '#fff',
    padding: 20,
    color: '#333',
    fontSize: 9,
    lineHeight: 1.3,
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* En-tête ATS */}
    <div style={{
      borderBottom: '1px solid #333',
      paddingBottom: 12,
      marginBottom: 20
    }}>
      <div style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 }}>
        {userData?.name?.toUpperCase() || 'NOM PRÉNOM'}
      </div>
      <div style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>
        {userData?.title || 'Poste'} | {userData?.email || 'email@example.com'} | {userData?.phone || '+33 6 12 34 56 78'}
      </div>
      <div style={{ fontSize: 9, color: '#888' }}>
        {userData?.location || 'Ville, Pays'} | {userData?.linkedin || 'linkedin.com/in/profile'}
      </div>
    </div>
    
    {/* Résumé */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 8, textTransform: 'uppercase' }}>
        Résumé Professionnel
      </div>
      <div style={{ fontSize: 9, color: '#333', lineHeight: 1.4 }}>
        {userData?.summary || 'Résumé professionnel...'}
      </div>
    </div>
    
    {/* Expérience */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 10, textTransform: 'uppercase' }}>
        Expérience Professionnelle
      </div>
      
      {Array.isArray(userData?.experiences) && userData.experiences.map((exp, index) => (
        <div key={index} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: '#333' }}>
              {exp.title}
            </div>
            <div style={{ fontSize: 9, color: '#666' }}>
              {exp.startDate} - {exp.endDate}
            </div>
          </div>
          <div style={{ fontSize: 10, color: '#333', marginBottom: 4, fontStyle: 'italic' }}>
            {exp.company}, {exp.location}
          </div>
          <div style={{ fontSize: 9, color: '#333', lineHeight: 1.4 }}>
            {(exp.alignedDescription || exp.description).split('•').map((bullet, bulletIndex) => (
              bullet.trim() && (
                <div key={bulletIndex} style={{ marginBottom: 2 }}>
                  • {bullet.trim()}
                </div>
              )
            ))}
          </div>
        </div>
      ))}
    </div>
    
    {/* Compétences */}
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 8, textTransform: 'uppercase' }}>
        Compétences Techniques
      </div>
      <div style={{ fontSize: 9, color: '#333', lineHeight: 1.4 }}>
        {Array.isArray(userData?.skills) && userData.skills.map((skill, index) => (
          <span key={index} style={{ marginRight: 8 }}>
            <strong>{skill}</strong>
            {index < userData.skills.length - 1 ? ',' : ''}
          </span>
        ))}
      </div>
    </div>
    
    {/* Formation */}
    <div>
      <div style={{ fontSize: 12, fontWeight: 'bold', color: '#333', marginBottom: 8, textTransform: 'uppercase' }}>
        Formation
      </div>
      <div style={{ fontSize: 9, color: '#333', lineHeight: 1.4 }}>
        {Array.isArray(userData?.education) && userData.education.map((edu, index) => (
          <div key={index}>
            <strong>{edu.degree}</strong> - {edu.school} ({edu.year})
          </div>
        ))}
      </div>
    </div>
  </div>
);

const GREEN = '#00ff99';

// Templates disponibles avec aperçus visuels
const templates = [
  {
    id: 'modern',
    name: 'Moderne',
    description: 'Design épuré et contemporain',
    preview: '🎨',
    color: '#00ff99',
    features: ['Design minimaliste', 'Mise en page aérée', 'Accents verts'],
    previewComponent: ModernPreview
  },
  {
    id: 'classic',
    name: 'Classique',
    description: 'Style professionnel traditionnel',
    preview: '📄',
    color: '#4a90e2',
    features: ['Layout traditionnel', 'Couleurs professionnelles', 'Structure claire'],
    previewComponent: ClassicPreview
  },
  {
    id: 'creative',
    name: 'Créatif',
    description: 'Design moderne et dynamique',
    preview: '✨',
    color: '#ff6b6b',
    features: ['Design asymétrique', 'Graphiques de scores', 'Couleurs vives'],
    previewComponent: CreativePreview
  },
  {
    id: 'ats',
    name: 'ATS-Friendly',
    description: 'Optimisé pour les systèmes de recrutement',
    preview: '🤖',
    color: '#333333',
    features: ['Format simple', 'Mots-clés mis en avant', 'Compatible ATS'],
    previewComponent: ATSPreview
  }
];

export default function TemplateSelectionStep({ 
  onTemplateSelect, 
  onBack, 
  selectedTemplate = null,
  userData = null,
  jobSummary = null
}) {
  const [hoveredTemplate, setHoveredTemplate] = useState(null);
  const [previewModal, setPreviewModal] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTemplateSelect = (template) => {
    setPreviewModal(template);
  };

  const handleConfirmTemplate = (template) => {
    onTemplateSelect(template);
    setPreviewModal(null);
  };

  const handleCloseModal = () => {
    setPreviewModal(null);
  };

  const handleGeneratePDF = async (template) => {
    if (!userData || !template) return;
    
    setIsGenerating(true);
    
    try {
      console.log('🚀 Starting PDF generation for template:', template.id);
      console.log('📋 User data:', userData);
      
      // Préparer les données pour l'API
      const pdfRequest = {
        template_id: template.id,
        user_data: {
          name: userData.name || 'Nom Prénom',
          title: userData.title || 'Poste',
          email: userData.email || 'email@example.com',
          phone: userData.phone || '+33 6 12 34 56 78',
          location: userData.location || 'Ville, Pays',
          linkedin: userData.linkedin || 'linkedin.com/in/profile',
          summary: userData.summary || 'Résumé professionnel...'
        },
        job_description: jobSummary?.job_description || '',
        job_summary: jobSummary?.summary || '',
        aligned_experiences: (userData.experiences || []).map(exp => ({
          old: {
            company: exp.company || 'Entreprise',
            position: exp.title || 'Poste',
            start_date: exp.startDate || '2020',
            end_date: exp.endDate || '2023',
            description: exp.description || 'Description de l\'expérience'
          },
          new: {
            company: exp.company || 'Entreprise',
            position: exp.title || 'Poste',
            start_date: exp.startDate || '2020',
            end_date: exp.endDate || '2023',
            description: exp.description || 'Description de l\'expérience'
          },
          score: 1.0,
          comment: "Validé par l'utilisateur"
        })),
        skills: Array.isArray(userData.skills) ? userData.skills : [],
        original_experiences: (userData.experiences || []).map(exp => ({
          company: exp.company || 'Entreprise',
          position: exp.title || 'Poste',
          start_date: exp.startDate || '2020',
          end_date: exp.endDate || '2023',
          description: exp.description || 'Description de l\'expérience'
        }))
      };

      console.log('📤 Sending PDF generation request:', pdfRequest);

      // Appeler l'API de génération de PDF
      const response = await fetch('http://localhost:8000/generate_pdf/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pdfRequest)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ PDF generation result:', result);

      if (result.success && result.pdf_file) {
        // Télécharger le PDF
        const downloadResponse = await fetch(`http://localhost:8000/download_pdf/${result.pdf_file.cv_id}`);
        
        if (downloadResponse.ok) {
          const blob = await downloadResponse.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `CV_${userData.name}_${template.name}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          console.log('✅ PDF downloaded successfully');
        } else {
          throw new Error('Failed to download PDF');
        }
      } else {
        throw new Error('PDF generation failed');
      }

    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      alert(`Erreur lors de la génération du PDF: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="frontpage-bg">
      <div className="bottom-progress-steps">
        <ProgressSteps currentStepIndex={4} />
      </div>
      <div className="validation-content">
        <div className="validation-header">
          <h1>🎨 Choisissez votre template</h1>
          <p style={{ 
            color: '#ccc', 
            fontSize: 16, 
            textAlign: 'center', 
            marginTop: 8,
            maxWidth: 600,
            margin: '8px auto 0'
          }}>
            Votre CV optimisé est prêt ! Sélectionnez un template pour le finaliser.
          </p>
        </div>

        {/* Template Selection Grid - Full Page Previews */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 20,
          marginTop: 40,
          padding: '0 20px',
          overflowX: 'auto',
          minHeight: 600
        }}>
          {templates.map((template) => (
            <div
              key={template.id}
              style={{
                minWidth: 280,
                maxWidth: 280,
                background: selectedTemplate?.id === template.id 
                  ? `linear-gradient(135deg, ${template.color}20, ${template.color}10)`
                  : 'rgba(30,34,44,0.97)',
                borderRadius: 16,
                padding: 16,
                border: selectedTemplate?.id === template.id 
                  ? `3px solid ${template.color}`
                  : '1.5px solid #444',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: hoveredTemplate === template.id ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hoveredTemplate === template.id 
                  ? `0 8px 25px ${template.color}30`
                  : '0 4px 15px rgba(0,0,0,0.3)',
                position: 'relative'
              }}
              onClick={() => handleTemplateSelect(template)}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              {/* Template Name */}
              <h3 style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 700,
                textAlign: 'center',
                margin: '0 0 12px 0'
              }}>
                {template.name}
              </h3>

              {/* Full Page CV Preview */}
              <div style={{
                width: '100%',
                height: 500,
                marginBottom: 12,
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid #444',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }}>
                <template.previewComponent />
              </div>

              {/* Template Features */}
              <div style={{ marginTop: 8 }}>
                {template.features.map((feature, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginBottom: 3,
                    fontSize: 10,
                    color: '#aaa'
                  }}>
                    <div style={{
                      width: 3,
                      height: 3,
                      borderRadius: '50%',
                      backgroundColor: template.color
                    }} />
                    {feature}
                  </div>
                ))}
              </div>

              {/* Selection Indicator */}
              {selectedTemplate?.id === template.id && (
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: template.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: 14
                }}>
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>



        {/* Action Buttons */}
        <div className="validation-actions" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 16, 
          marginTop: 40 
        }}>
          <button 
            className="frontpage-navbar-btn" 
            type="button" 
            onClick={onBack}
            style={{
              backgroundColor: 'transparent',
              color: GREEN,
              border: `2px solid ${GREEN}`
            }}
          >
            ⬅ Retour
          </button>
          <button 
            className="frontpage-navbar-btn" 
            type="button" 
            onClick={() => selectedTemplate && handleGeneratePDF(selectedTemplate)}
            disabled={!selectedTemplate || isGenerating}
            style={{
              backgroundColor: selectedTemplate && !isGenerating ? GREEN : '#444',
              color: selectedTemplate && !isGenerating ? '#000' : '#666',
              border: 'none',
              cursor: selectedTemplate && !isGenerating ? 'pointer' : 'not-allowed'
            }}
          >
            {isGenerating ? '⏳ Génération...' : '📄 Générer le CV'}
          </button>
        </div>
      </div>

      {/* Modal de prévisualisation */}
      {previewModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: 'rgba(30,34,44,0.98)',
            borderRadius: 16,
            padding: 24,
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto',
            border: `2px solid ${previewModal.color}`,
            position: 'relative'
          }}>
            {/* En-tête de la modal */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: '1px solid #444'
            }}>
              <h2 style={{ color: '#fff', margin: 0, fontSize: 20 }}>
                Aperçu du template {previewModal.name}
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: 24,
                  cursor: 'pointer',
                  padding: 0,
                  width: 30,
                  height: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            {/* Aperçu du CV avec vraies données */}
            <div style={{
              width: '100%',
              maxHeight: '60vh',
              borderRadius: 8,
              overflow: 'auto',
              border: '1px solid #444',
              background: '#fff',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
            }}>
              {previewModal.id === 'modern' && (
                <ModernPreviewWithData userData={userData} jobSummary={jobSummary} />
              )}
              {previewModal.id === 'classic' && (
                <ClassicPreviewWithData userData={userData} jobSummary={jobSummary} />
              )}
              {previewModal.id === 'creative' && (
                <CreativePreviewWithData userData={userData} jobSummary={jobSummary} />
              )}
              {previewModal.id === 'ats' && (
                <ATSPreviewWithData userData={userData} jobSummary={jobSummary} />
              )}
            </div>

            {/* Actions de la modal */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              marginTop: 24
            }}>
              <button 
                className="frontpage-navbar-btn" 
                type="button" 
                onClick={handleCloseModal}
                style={{
                  backgroundColor: 'transparent',
                  color: '#fff',
                  border: '2px solid #666'
                }}
              >
                Annuler
              </button>
              <button 
                className="frontpage-navbar-btn" 
                type="button" 
                onClick={() => handleGeneratePDF(previewModal)}
                disabled={isGenerating}
                style={{
                  backgroundColor: isGenerating ? '#444' : previewModal.color,
                  color: isGenerating ? '#666' : '#000',
                  border: 'none',
                  cursor: isGenerating ? 'not-allowed' : 'pointer'
                }}
              >
                {isGenerating ? '⏳ Génération...' : '📄 Générer le CV'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 