import React, { useState, useEffect } from 'react';

export default function ResumeValidation({ ocrResultId, onValidationComplete }) {
  const [structuredData, setStructuredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editableData, setEditableData] = useState(null);

  useEffect(() => {
    // Récupérer les données extraites du localStorage
    try {
      const storedData = localStorage.getItem('structured_data');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setStructuredData(parsedData);
        setEditableData(parsedData); // Initialiser les données modifiables
        console.log('📋 Données extraites récupérées:', parsedData);
      } else {
        setError('Aucune donnée extraite trouvée. Veuillez télécharger votre CV à nouveau.');
      }
    } catch (err) {
      setError('Erreur lors de la récupération des données extraites.');
      console.error('Erreur parsing données:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleContinue = () => {
    if (editableData) {
      onValidationComplete(editableData);
    }
  };

  const updatePersonalInfo = (field, value) => {
    setEditableData(prev => ({
      ...prev,
      personal_information: {
        ...prev.personal_information,
        [field]: value
      }
    }));
  };

  const updateExperience = (index, field, value) => {
    setEditableData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addExperience = () => {
    setEditableData(prev => ({
      ...prev,
      experiences: [{
        title: '',
        company: '',
        location: '',
        start_date: '',
        end_date: '',
        description: ''
      }, ...prev.experiences]
    }));
  };

  const removeExperience = (index) => {
    setEditableData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  const updateEducation = (index, field, value) => {
    setEditableData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addEducation = () => {
    setEditableData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        institution: '',
        location: '',
        start_date: '',
        end_date: '',
        description: ''
      }]
    }));
  };

  const removeEducation = (index) => {
    setEditableData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateSkills = (index, value) => {
    setEditableData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const addSkill = () => {
    setEditableData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const removeSkill = (index) => {
    setEditableData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const updateLanguage = (index, field, value) => {
    setEditableData(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) => 
        i === index ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const addLanguage = () => {
    setEditableData(prev => ({
      ...prev,
      languages: [...prev.languages, { language: '', level: '' }]
    }));
  };

  const removeLanguage = (index) => {
    setEditableData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const updateCertification = (index, field, value) => {
    setEditableData(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }));
  };

  const addCertification = () => {
    setEditableData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { name: '', issuer: '', date: '' }]
    }));
  };

  const removeCertification = (index) => {
    setEditableData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const updateProject = (index, field, value) => {
    setEditableData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }));
  };

  const addProject = () => {
    setEditableData(prev => ({
      ...prev,
      projects: [{
        name: '',
        description: '',
        technologies: '',
        date: ''
      }, ...prev.projects]
    }));
  };

  const removeProject = (index) => {
    setEditableData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        color: 'white', 
        maxWidth: '1200px', 
        margin: '0 auto',
        backgroundColor: 'rgba(30,34,44,0.8)',
        borderRadius: '12px',
        marginTop: '20px',
        marginBottom: '40px',
        textAlign: 'center'
      }}>
        <div className="loading-spinner" style={{ margin: '20px auto' }}></div>
        <p>Chargement des données extraites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        color: 'white', 
        maxWidth: '1200px', 
        margin: '0 auto',
        backgroundColor: 'rgba(30,34,44,0.8)',
        borderRadius: '12px',
        marginTop: '20px',
        marginBottom: '40px',
        border: '1px solid #ff4444'
      }}>
        <h2 style={{ color: '#ff4444', marginBottom: '10px' }}>Erreur</h2>
        <p style={{ color: '#ccc', marginBottom: '20px' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#00ff99',
            color: '#000',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Recharger la page
        </button>
      </div>
    );
  }

  if (!editableData) {
    return (
      <div style={{ 
        padding: '20px', 
        color: 'white', 
        maxWidth: '1200px', 
        margin: '0 auto',
        backgroundColor: 'rgba(30,34,44,0.8)',
        borderRadius: '12px',
        marginTop: '20px',
        marginBottom: '40px'
      }}>
        <h2 style={{ color: '#ff4444', marginBottom: '10px' }}>Aucune donnée</h2>
        <p style={{ color: '#ccc', marginBottom: '20px' }}>Aucune donnée extraite trouvée.</p>
      </div>
    );
  }
// Nouveau rendu minimal :
  

return (
    <div className="validation-content" >
      <div className="validation-section" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        
        {/* Carte des informations personnelles */}
        <div className="personal-info-card" style={{ flex: 0.8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#00ff99', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
              Informations personnelles
            </h3>
            <div style={{ width: '80px' }}></div>
          </div>

          <div style={{ 
            border: '1px solid #444', 
            borderRadius: '0px', 
            padding: '15px', 
            backgroundColor: 'rgba(255,255,255,0.05)'
          }}>
            <div className="form-group">
              <label htmlFor="name">Nom</label>
                <input
                id="name"
                  type="text"
                className="form-input"
                style={{ borderRadius: 0 }}
                value={editableData?.personal_information?.name || ''}
                onChange={e => updatePersonalInfo('name', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
                      <input
                id="email"
                type="email"
                className="form-input"
                style={{ borderRadius: 0 }}
                value={editableData?.personal_information?.email || ''}
                onChange={e => updatePersonalInfo('email', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>
                      <input
                id="phone"
                        type="text"
                className="form-input"
                style={{ borderRadius: 0 }}
                value={editableData?.personal_information?.phone || ''}
                onChange={e => updatePersonalInfo('phone', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Adresse</label>
                  <input
                id="address"
                    type="text"
                className="form-input"
                style={{ borderRadius: 0 }}
                value={editableData?.personal_information?.address || ''}
                onChange={e => updatePersonalInfo('address', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="linkedin">LinkedIn</label>
                  <input
                id="linkedin"
                type="url"
                className="form-input"
                style={{ borderRadius: 0 }}
                value={editableData?.personal_information?.linkedin || ''}
                onChange={e => updatePersonalInfo('linkedin', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Carte des expériences professionnelles */}
        <div className="experiences-card" style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#00ff99', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
              Expériences professionnelles
            </h3>
            <button
              onClick={addExperience}
              style={{
                backgroundColor: '#00ff99',
                color: '#000',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              + Ajouter
            </button>
          </div>

          <div style={{ maxHeight: '800px', overflowY: 'auto' }}>
            {editableData?.experiences?.map((experience, index) => (
              <div 
                key={index} 
                style={{ 
                  border: '1px solid #444', 
                  borderRadius: '0px', 
                  padding: '15px', 
                  marginBottom: '15px',
                  backgroundColor: 'rgba(255,255,255,0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ color: '#00ff99', margin: 0, fontSize: '16px' }}>
                    Expérience {index + 1}
                  </h4>
                  <button
                    onClick={() => removeExperience(index)}
                    style={{
                      backgroundColor: '#ff4444',
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Supprimer
                  </button>
                </div>

                <div className="form-group">
                  <label>Poste</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderRadius: 0 }}
                    value={experience.title || ''}
                    onChange={e => updateExperience(index, 'title', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Entreprise</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderRadius: 0 }}
                    value={experience.company || ''}
                    onChange={e => updateExperience(index, 'company', e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Lieu</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderRadius: 0 }}
                      value={experience.location || ''}
                      onChange={e => updateExperience(index, 'location', e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Date début</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderRadius: 0 }}
                      value={experience.start_date || ''}
                      onChange={e => updateExperience(index, 'start_date', e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Date fin</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderRadius: 0 }}
                      value={experience.end_date || ''}
                      onChange={e => updateExperience(index, 'end_date', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-input"
                    style={{ 
                      borderRadius: 0, 
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                    value={experience.description || ''}
                    onChange={e => updateExperience(index, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carte des projets */}
        <div className="projects-card" style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#00ff99', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
              Projets
            </h3>
            <button
              onClick={addProject}
              style={{
                backgroundColor: '#00ff99',
                color: '#000',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              + Ajouter
            </button>
          </div>

          <div style={{ maxHeight: '800px', overflowY: 'auto' }}>
            {editableData?.projects?.map((project, index) => (
              <div 
                key={index} 
                style={{ 
                  border: '1px solid #444', 
                  borderRadius: '0px', 
                  padding: '15px', 
                  marginBottom: '15px',
                  backgroundColor: 'rgba(255,255,255,0.05)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ color: '#00ff99', margin: 0, fontSize: '16px' }}>
                    Projet {index + 1}
                  </h4>
                  <button
                    onClick={() => removeProject(index)}
                    style={{
                      backgroundColor: '#ff4444',
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Supprimer
                  </button>
                </div>

                <div className="form-group">
                  <label>Nom du projet</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderRadius: 0 }}
                    value={project.name || ''}
                    onChange={e => updateProject(index, 'name', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Technologies</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderRadius: 0 }}
                    value={project.technologies || ''}
                    onChange={e => updateProject(index, 'technologies', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderRadius: 0 }}
                    value={project.date || ''}
                    onChange={e => updateProject(index, 'date', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-input"
                    style={{ 
                      borderRadius: 0, 
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                    value={project.description || ''}
                    onChange={e => updateProject(index, 'description', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}