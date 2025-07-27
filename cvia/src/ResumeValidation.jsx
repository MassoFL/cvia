import React, { useState, useEffect, useCallback } from 'react';
import './ResumeValidation.css';
import { FaUser, FaGraduationCap, FaBriefcase, FaTools, FaCheck, FaEdit, FaSave, FaTimes, FaPlus, FaTrash, FaInfoCircle } from 'react-icons/fa';
import { ProgressSteps } from './FrontPage';

// Utility function to get data regardless of case and field variations
const getDataField = (data, fieldName) => {
  if (!data) return null;
  
  // Try multiple variations of the field name
  const variations = [
    fieldName,
    fieldName.toLowerCase(),
    fieldName.toUpperCase(),
    fieldName.replace('_', ''),
    fieldName.replace('_', ' '),
    // Common variations
    fieldName === 'personal_information' ? 'personal_info' : null,
    fieldName === 'personal_info' ? 'personal_information' : null,
    fieldName === 'experiences' ? 'experience' : null,
    fieldName === 'experience' ? 'experiences' : null,
    // New structure variations
    fieldName === 'skills' ? 'competences' : null,
    fieldName === 'competences' ? 'skills' : null,
    fieldName === 'certifications' ? 'certificats' : null,
    fieldName === 'certificats' ? 'certifications' : null,
    fieldName === 'projects' ? 'projets' : null,
    fieldName === 'projets' ? 'projects' : null,
    fieldName === 'publications' ? 'publications' : null,
    fieldName === 'awards' ? 'recompenses' : null,
    fieldName === 'recompenses' ? 'awards' : null,
    fieldName === 'volunteer' ? 'benevolat' : null,
    fieldName === 'benevolat' ? 'volunteer' : null,
    // Text analysis format
    fieldName === 'interests' ? 'centres_interet' : null,
    fieldName === 'centres_interet' ? 'interests' : null,
    fieldName === 'summary' ? 'resume' : null,
    fieldName === 'resume' ? 'summary' : null,
    fieldName === 'objectives' ? 'objectifs' : null,
    fieldName === 'objectifs' ? 'objectives' : null,
    fieldName === 'references' ? 'references' : null,
    fieldName === 'additional_info' ? 'info_supplementaires' : null,
    fieldName === 'info_supplementaires' ? 'additional_info' : null,
  ].filter(Boolean);
  
  for (const variation of variations) {
    if (data[variation] !== undefined) {
      return data[variation];
    }
  }
  
  return null;
};

// Utility function to get array data (handles both direct arrays and nested objects)
const getArrayData = (data, fieldName) => {
  if (!data) return [];
  
  const field = getDataField(data, fieldName);
  if (!field) return [];
  
  // If it's already an array, return it directly
  if (Array.isArray(field)) {
    return field;
  }
  
  // If it's an object with a property of the same name, return that
  if (field && typeof field === 'object' && field[fieldName]) {
    return field[fieldName] || [];
  }
  
  // Special handling for skills - new structure
  if (fieldName === 'skills' && typeof field === 'object') {
    // Handle new skills structure: { technical: [], soft: [], languages: [], tools: [], methodologies: [] }
    const allSkills = [];
    if (field.technical && Array.isArray(field.technical)) {
      allSkills.push(...field.technical);
    }
    if (field.soft && Array.isArray(field.soft)) {
      allSkills.push(...field.soft);
    }
    if (field.tools && Array.isArray(field.tools)) {
      allSkills.push(...field.tools);
    }
    if (field.methodologies && Array.isArray(field.methodologies)) {
      allSkills.push(...field.methodologies);
    }
    return allSkills;
  }
  
  // Special handling for skills - might be a string
  if (fieldName === 'skills' && typeof field === 'string') {
    return field.split(',').map(s => s.trim()).filter(s => s);
  }
  
  return [];
};

// New function to get specific skill categories
const getSkillCategory = (data, category) => {
  if (!data) return [];
  
  const skills = getDataField(data, 'skills');
  if (!skills || typeof skills !== 'object') return [];
  
  return skills[category] || [];
};

// New function to handle text analysis format
const getTextAnalysisData = (data, fieldName) => {
  if (!data) return null;
  
  const field = getDataField(data, fieldName);
  if (!field) return null;
  
  // If it's an object with raw_text, return the raw_text
  if (field && typeof field === 'object' && field.raw_text) {
    return field.raw_text;
  }
  
  // If it's a string, return it directly
  if (typeof field === 'string') {
    return field;
  }
  
  // If it's an array, join the elements
  if (Array.isArray(field)) {
    return field.join('\n');
  }
  
  return null;
};

function ResumeValidation({ ocrResultId, onValidationComplete }) {
  const [resumeData, setResumeData] = useState(null);
  const [extractionLoading, setExtractionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [newTechnicalSkill, setNewTechnicalSkill] = useState('');
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  // Get structured data from resume data (ChatGPT format)
  const structuredData = resumeData?.extracted_data || resumeData?.data || resumeData;

  const fetchResumeData = useCallback(async (id) => {
    try {
      // Éviter les conflits d'état - un seul état actif à la fois
      setExtractionLoading(true);
      setError(null);
      
      // Utiliser le nouvel endpoint pour récupérer les données extraites par ChatGPT
      const response = await fetch(`http://localhost:8000/api/v1/extracted_data/${id}`);
      
      if (response.status === 404) {
        // File not found or extraction still in progress
        // Garder extractionLoading = true et continuer le polling
        setTimeout(() => fetchResumeData(id), 2000);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch resume data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check if we have a processing status response
      if (data.status === 'processing') {
        // Garder extractionLoading = true et continuer le polling
        setTimeout(() => fetchResumeData(id), 2000);
        return;
      }
      
      // The API returns the database record, with structured data in the 'extracted_data' field
      setResumeData(data);
      
      const structuredData = data.extracted_data || data.data || data;
      setEditedData(structuredData); // Initialize edited data with the structured data
      
      // Debug: Afficher la structure des données reçues
      console.log('🔍 Données reçues du backend:', data);
      console.log('🔍 Données structurées:', structuredData);
      console.log('🔍 Expériences trouvées:', getArrayData(structuredData, 'experiences'));
      console.log('🔍 Formation trouvée:', getArrayData(structuredData, 'education'));
      console.log('🔍 Compétences trouvées:', getArrayData(structuredData, 'skills'));
      console.log('🔍 Compétences techniques:', getSkillCategory(structuredData, 'technical'));
      console.log('🔍 Compétences soft:', getSkillCategory(structuredData, 'soft'));
      console.log('🔍 Langues:', getSkillCategory(structuredData, 'languages'));
      console.log('🔍 Outils:', getSkillCategory(structuredData, 'tools'));
      console.log('🔍 Méthodologies:', getSkillCategory(structuredData, 'methodologies'));
      console.log('🔍 Frameworks:', getSkillCategory(structuredData, 'frameworks'));
      console.log('🔍 Bases de données:', getSkillCategory(structuredData, 'databases'));
      console.log('🔍 Cloud:', getSkillCategory(structuredData, 'cloud'));
      console.log('🔍 Autres compétences:', getSkillCategory(structuredData, 'other'));
      console.log('🔍 Certifications:', getArrayData(structuredData, 'certifications'));
      console.log('🔍 Projets:', getArrayData(structuredData, 'projects'));
      console.log('🔍 Publications:', getArrayData(structuredData, 'publications'));
      console.log('🔍 Récompenses:', getArrayData(structuredData, 'awards'));
      console.log('🔍 Bénévolat:', getArrayData(structuredData, 'volunteer'));
      console.log('🔍 Centres d\'intérêt:', getDataField(structuredData, 'interests'));
      console.log('🔍 Résumé:', getDataField(structuredData, 'summary'));
      console.log('🔍 Objectifs:', getDataField(structuredData, 'objectives'));
      console.log('🔍 Références:', getDataField(structuredData, 'references'));
      console.log('🔍 Informations additionnelles:', getDataField(structuredData, 'additional_info'));
      
      setExtractionLoading(false); // Extraction terminée
    } catch (err) {
      console.error('Error fetching resume data:', err);
      setError(err.message);
      setExtractionLoading(false);
    }
  }, []);

  // Fetch resume data when component mounts
  useEffect(() => {
    if (ocrResultId && !extractionLoading && !resumeData) {
      fetchResumeData(ocrResultId);
    }
  }, [ocrResultId, fetchResumeData, extractionLoading, resumeData]);

  const handleEdit = (section) => {
    setEditingSection(section);
  };

  const handleSave = (section) => {
    setEditingSection(null);
    // Here you would typically save the changes to the backend
    console.log('Saving changes for section:', section);
    
    // Trigger validation after saving to update error messages
    setTimeout(() => {
      validateExperiences();
    }, 100); // Small delay to ensure state is updated
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditedData(resumeData?.extracted_data || resumeData?.data || resumeData); // Reset to original structured data
  };

  const handleFieldChange = (section, field, value) => {
    setEditedData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayFieldChange = (section, index, value) => {
    console.log('handleArrayFieldChange called:', { section, index, value });
    setEditedData(prev => {
      const newData = { ...prev };
      if (!newData[section]) newData[section] = [];
      if (!newData[section][index]) newData[section][index] = {};
      newData[section][index] = { ...newData[section][index], ...value };
      console.log('Updated data:', newData);
      return newData;
    });
  };

  const handleAddSkill = (skillType, skillValue) => {
    if (!skillValue?.trim()) return;
    
    setEditedData(prev => {
      const newData = { ...prev };
      if (!newData.skills) newData.skills = {};
      if (!Array.isArray(newData.skills[skillType])) newData.skills[skillType] = [];
      
      // Éviter les doublons
      if (!newData.skills[skillType].includes(skillValue.trim())) {
        newData.skills[skillType].push(skillValue.trim());
      }
      
      return newData;
    });
  };

  const handleRemoveSkill = (skillType, index) => {
    setEditedData(prev => {
      const newData = { ...prev };
      if (newData.skills && newData.skills[skillType]) {
        newData.skills[skillType] = newData.skills[skillType].filter((_, i) => i !== index);
      }
      return newData;
    });
  };

  const handleAddExperience = () => {
    setEditedData(prev => {
      const newData = { ...prev };
      if (!newData.experiences) newData.experiences = [];
      newData.experiences.unshift({
        title: '',
        company: '',
        start_date: '',
        end_date: '',
        description: ''
      });
      return newData;
    });
    setEditingSection('experiences-0');
  };

  const handleDeleteExperience = (index) => {
    console.log('handleDeleteExperience called with index:', index);
    
    setEditedData(prev => {
      const newData = { ...prev };
      
      // Ensure experiences array exists
      if (!newData.experiences) {
        console.log('No experiences array found, creating one');
        newData.experiences = [];
      }
      
      console.log('Before deletion:', newData.experiences);
      console.log('Array length:', newData.experiences.length);
      
      if (newData.experiences.length > index) {
        newData.experiences = newData.experiences.filter((_, i) => i !== index);
        console.log('After deletion:', newData.experiences);
      } else {
        console.log('Index out of bounds');
      }
      
      return newData;
    });
    
    // Clean up validation errors and adjust indices
    setValidationErrors(prev => {
      const newErrors = prev
        .filter(err => err !== index) // Remove the deleted index
        .map(err => err > index ? err - 1 : err); // Adjust indices after the deleted item
      console.log('Updated validation errors:', newErrors);
      return newErrors;
    });
  };

  const validateExperiences = () => {
    const experiences = getArrayData(editedData || structuredData, 'experiences');
    const errors = [];
    const problematicExperiences = [];

    experiences.forEach((exp, index) => {
      const hasErrors = [];
      if (!exp.title || exp.title.trim() === '') {
        hasErrors.push('titre');
      }
      if (!exp.start_date || exp.start_date.trim() === '') {
        hasErrors.push('date de début');
      }
      if (!exp.end_date || exp.end_date.trim() === '') {
        hasErrors.push('date de fin');
      }
      
      if (hasErrors.length > 0) {
        problematicExperiences.push(index);
      }
    });

    setValidationErrors(problematicExperiences);
    return problematicExperiences.length === 0;
  };

  const handleValidationComplete = () => {
    const isValid = validateExperiences();
    
    if (!isValid) {
      // Smart scroll vers la première expérience avec des données manquantes
      setTimeout(() => {
        // Chercher la première expérience avec une erreur
        const experienceItems = document.querySelectorAll('.experience-item');
        let firstErrorExperience = null;
        
        experienceItems.forEach((item, index) => {
          // Vérifier si cette expérience a une erreur
          const errorMessage = item.querySelector('.error-help-message');
          if (errorMessage && !firstErrorExperience) {
            firstErrorExperience = item;
          }
        });
        
        if (firstErrorExperience) {
          // Scroll vers la première expérience avec une erreur
          firstErrorExperience.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        } else {
          // Fallback: scroll vers le premier message d'erreur
          const firstErrorElement = document.querySelector('.error-help-message');
          if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }
      }, 100); // Petit délai pour s'assurer que les erreurs sont affichées
      return; // Les erreurs sont affichées visuellement
    }

    // Si tout est valide, continuer
    if (onValidationComplete) {
      onValidationComplete(editedData || structuredData);
    }
  };

  // État d'extraction en cours - priorité sur tous les autres états
  if (extractionLoading) {
    return (
      <>
        {/* Progress Steps juste après la navbar */}
        <div className="bottom-progress-steps">
          <ProgressSteps currentStepIndex={1} />
        </div>
        
        <div className="validation-content">
          <div className="extraction-loading-container">
            <div className="extraction-loading-spinner" />
            <h2>Extraction des données en cours...</h2>
            <p>ChatGPT analyse votre CV et extrait les informations structurées.</p>
            <div className="extraction-progress">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        {/* Progress Steps juste après la navbar */}
        <div className="bottom-progress-steps">
          <ProgressSteps currentStepIndex={1} />
        </div>
        
        <div className="validation-content">
          <div className="error-container">
            <h2>Erreur lors de l'extraction</h2>
            <p>{error}</p>
            <button 
              onClick={() => {
                setError(null);
                if (ocrResultId) {
                  fetchResumeData(ocrResultId);
                }
              }}
              style={{
                background: '#00ff99',
                color: '#111',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                marginTop: '20px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </>
    );
  }

  // Check if we have the structured data
  if (!resumeData) {
    return (
      <>
        {/* Progress Steps juste après la navbar */}
        <div className="bottom-progress-steps">
          <ProgressSteps currentStepIndex={1} />
        </div>
        
        <div className="validation-content">
          <div className="error-container">
            <p>Aucune donnée structurée trouvée pour ce CV</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Progress Steps juste après la navbar */}
      <div className="bottom-progress-steps">
        <ProgressSteps currentStepIndex={1} />
      </div>
      
      <div className="validation-content">
        <div className="validation-header">
          <h1>Validation des données</h1>
          <p>Données extraites par ChatGPT - Vérifiez et corrigez si nécessaire</p>
        </div>

        <div className="validation-sections">
          {/* Personal Information Section */}
          <div className="validation-section">
            <div className="section-header">
              <FaUser className="section-icon" />
              <h2>Informations personnelles</h2>
              {editingSection !== 'personal_information' ? (
                <button className="edit-btn" onClick={() => handleEdit('personal_information')}>
                  <FaEdit /> Modifier
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={() => handleSave('personal_information')}>
                    <FaSave /> Sauvegarder
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    <FaTimes /> Annuler
                  </button>
                </div>
              )}
            </div>
            <div className="section-content">
              <div className="field-group">
                <label>Nom complet:</label>
                {editingSection === 'personal_information' ? (
                  <input
                    type="text"
                    value={getDataField(editedData, 'personal_information')?.name || ''}
                    onChange={(e) => handleFieldChange('personal_information', 'name', e.target.value)}
                  />
                ) : (
                  <span>{getDataField(structuredData, 'personal_information')?.name || 'Non spécifié'}</span>
                )}
              </div>
              <div className="field-group">
                <label>Email:</label>
                {editingSection === 'personal_information' ? (
                  <input
                    type="email"
                    value={getDataField(editedData, 'personal_information')?.email || ''}
                    onChange={(e) => handleFieldChange('personal_information', 'email', e.target.value)}
                  />
                ) : (
                  <span>{getDataField(structuredData, 'personal_information')?.email || 'Non spécifié'}</span>
                )}
              </div>
              <div className="field-group">
                <label>Téléphone:</label>
                {editingSection === 'personal_information' ? (
                  <input
                    type="text"
                    value={getDataField(editedData, 'personal_information')?.phone || ''}
                    onChange={(e) => handleFieldChange('personal_information', 'phone', e.target.value)}
                  />
                ) : (
                  <span>{getDataField(structuredData, 'personal_information')?.phone || 'Non spécifié'}</span>
                )}
              </div>
              <div className="field-group">
                <label>Adresse:</label>
                {editingSection === 'personal_information' ? (
                  <input
                    type="text"
                    value={getDataField(editedData, 'personal_information')?.address || ''}
                    onChange={(e) => handleFieldChange('personal_information', 'address', e.target.value)}
                  />
                ) : (
                  <span>{getDataField(structuredData, 'personal_information')?.address || 'Non spécifié'}</span>
                )}
              </div>
              <div className="field-group">
                <label>LinkedIn:</label>
                {editingSection === 'personal_information' ? (
                  <input
                    type="text"
                    value={getDataField(editedData, 'personal_information')?.linkedin || ''}
                    onChange={(e) => handleFieldChange('personal_information', 'linkedin', e.target.value)}
                  />
                ) : (
                  <span>{getDataField(structuredData, 'personal_information')?.linkedin || 'Non spécifié'}</span>
                )}
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="validation-section">
            <div className="section-header">
              <FaGraduationCap className="section-icon" />
              <h2>Formation</h2>
              {editingSection !== 'education' ? (
                <button className="edit-btn" onClick={() => handleEdit('education')}>
                  <FaEdit /> Modifier
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={() => handleSave('education')}>
                    <FaSave /> Sauvegarder
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    <FaTimes /> Annuler
                  </button>
                </div>
              )}
            </div>
            <div className="section-content">
              {extractionLoading && (getArrayData(editedData, 'education') || getArrayData(structuredData, 'education')).length === 0 ? (
                <div className="loading-placeholder">
                  <div className="extraction-spinner" />
                  <span>Extraction des formations en cours...</span>
                </div>
              ) : (
                (getArrayData(editedData, 'education') || getArrayData(structuredData, 'education')).map((edu, index) => (
                  <div key={index} className="education-item">
                    <div className="field-group">
                      <label>Établissement:</label>
                      {editingSection === 'education' ? (
                        <input
                          type="text"
                          value={edu.institution || ''}
                          onChange={(e) => handleArrayFieldChange('education', index, { institution: e.target.value })}
                        />
                      ) : (
                        <span>{edu.institution || 'Non spécifié'}</span>
                      )}
                    </div>
                    <div className="field-group">
                      <label>Diplôme:</label>
                      {editingSection === 'education' ? (
                        <input
                          type="text"
                          value={edu.degree || ''}
                          onChange={(e) => handleArrayFieldChange('education', index, { degree: e.target.value })}
                        />
                      ) : (
                        <span>{edu.degree || 'Non spécifié'}</span>
                      )}
                    </div>
                    <div className="field-group">
                      <label>Lieu:</label>
                      {editingSection === 'education' ? (
                        <input
                          type="text"
                          value={edu.location || ''}
                          onChange={(e) => handleArrayFieldChange('education', index, { location: e.target.value })}
                        />
                      ) : (
                        <span>{edu.location || 'Non spécifié'}</span>
                      )}
                    </div>
                    <div className="field-group">
                      <label>Date de début:</label>
                      {editingSection === 'education' ? (
                        <input
                          type="text"
                          value={edu.start_date || ''}
                          onChange={(e) => handleArrayFieldChange('education', index, { start_date: e.target.value })}
                        />
                      ) : (
                        <span>{edu.start_date || 'Non spécifié'}</span>
                      )}
                    </div>
                    <div className="field-group">
                      <label>Date de fin:</label>
                      {editingSection === 'education' ? (
                        <input
                          type="text"
                          value={edu.end_date || ''}
                          onChange={(e) => handleArrayFieldChange('education', index, { end_date: e.target.value })}
                        />
                      ) : (
                        <span>{edu.end_date || 'Non spécifié'}</span>
                      )}
                    </div>
                    <div className="field-group">
                      <label>Description:</label>
                      {editingSection === 'education' ? (
                        <textarea
                          value={edu.description || ''}
                          onChange={(e) => handleArrayFieldChange('education', index, { description: e.target.value })}
                          rows="2"
                        />
                      ) : (
                        <span>{edu.description || 'Non spécifié'}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Experience Section */}
          <div className="validation-section">
            <div className="section-header">
              <FaBriefcase className="section-icon" />
              <h2>Expériences</h2>
              <button className="add-experience-btn" onClick={handleAddExperience}>
                <FaPlus /> Ajouter une expérience
              </button>
            </div>
            <div className="section-content">
              {extractionLoading && getArrayData(structuredData, 'experiences').length === 0 ? (
                <div className="loading-placeholder">
                  <div className="extraction-spinner" />
                  <span>Extraction des expériences en cours...</span>
                </div>
              ) : (
                getArrayData(editedData || structuredData, 'experiences').map((exp, index) => {
                  // Get the correct data source based on editing state
                  const currentExp = editingSection === `experiences-${index}` 
                    ? (getArrayData(editedData, 'experiences')[index] || exp)
                    : exp;
                  
                  return (
                    <div key={index} className="experience-item">
                      {validationErrors.includes(index) && (
                        <div className="error-help-message">
                          ⚠️ Veuillez compléter les informations non spécifiés
                        </div>
                      )}
                      <div className="experience-header">
                        <h3>Expérience {index + 1}</h3>
                        {editingSection !== `experiences-${index}` ? (
                          <div className="experience-actions">
                            <button className="edit-btn" onClick={() => handleEdit(`experiences-${index}`)}>
                              <FaEdit /> Modifier
                            </button>
                            <button className="delete-btn" onClick={() => handleDeleteExperience(index)}>
                              <FaTrash /> Supprimer
                            </button>
                          </div>
                        ) : (
                          <div className="edit-actions">
                            <button className="save-btn" onClick={() => handleSave(`experiences-${index}`)}>
                              <FaSave /> Sauvegarder
                            </button>
                            <button className="cancel-btn" onClick={handleCancel}>
                              <FaTimes /> Annuler
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="field-group">
                        <label>Titre du poste *:</label>
                        {editingSection === `experiences-${index}` ? (
                          <input
                            type="text"
                            value={currentExp.title || ''}
                            onChange={(e) => handleArrayFieldChange('experiences', index, { title: e.target.value })}
                          />
                        ) : (
                          <span 
                            className={!currentExp.title || currentExp.title.trim() === '' ? 'missing-field clickable' : ''}
                            onClick={(!currentExp.title || currentExp.title.trim() === '') ? () => handleEdit(`experiences-${index}`) : undefined}
                          >
                            {currentExp.title || 'Non spécifié'}
                          </span>
                        )}
                      </div>
                      <div className="field-group">
                        <label>Entreprise:</label>
                        {editingSection === `experiences-${index}` ? (
                          <input
                            type="text"
                            value={currentExp.company || ''}
                            onChange={(e) => handleArrayFieldChange('experiences', index, { company: e.target.value })}
                          />
                        ) : (
                          <span>{currentExp.company || 'Non spécifié'}</span>
                        )}
                      </div>
                      <div className="field-group">
                        <label>Lieu:</label>
                        {editingSection === `experiences-${index}` ? (
                          <input
                            type="text"
                            value={currentExp.location || ''}
                            onChange={(e) => handleArrayFieldChange('experiences', index, { location: e.target.value })}
                          />
                        ) : (
                          <span>{currentExp.location || 'Non spécifié'}</span>
                        )}
                      </div>
                      <div className="date-range">
                        <div className="field-group">
                          <label>Date de début *:</label>
                          {editingSection === `experiences-${index}` ? (
                            <input
                              type="text"
                              value={currentExp.start_date || ''}
                              onChange={(e) => handleArrayFieldChange('experiences', index, { start_date: e.target.value })}
                            />
                          ) : (
                            <span 
                              className={!currentExp.start_date || currentExp.start_date.trim() === '' ? 'missing-field clickable' : ''}
                              onClick={(!currentExp.start_date || currentExp.start_date.trim() === '') ? () => handleEdit(`experiences-${index}`) : undefined}
                            >
                              {currentExp.start_date || 'Non spécifié'}
                            </span>
                          )}
                        </div>
                        <div className="field-group">
                          <label>Date de fin *:</label>
                          {editingSection === `experiences-${index}` ? (
                            <input
                              type="text"
                              value={currentExp.end_date || ''}
                              onChange={(e) => handleArrayFieldChange('experiences', index, { end_date: e.target.value })}
                            />
                          ) : (
                            <span 
                              className={!currentExp.end_date || currentExp.end_date.trim() === '' ? 'missing-field clickable' : ''}
                              onClick={(!currentExp.end_date || currentExp.end_date.trim() === '') ? () => handleEdit(`experiences-${index}`) : undefined}
                            >
                              {currentExp.end_date || 'Non spécifié'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="field-group">
                        <label>Description:</label>
                        {editingSection === `experiences-${index}` ? (
                          <textarea
                            value={currentExp.description || ''}
                            onChange={(e) => handleArrayFieldChange('experiences', index, { description: e.target.value })}
                            rows="3"
                          />
                        ) : (
                          <span>{currentExp.description || 'Non spécifié'}</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Skills Section */}
          <div className="validation-section">
            <div className="section-header">
              <FaTools className="section-icon" />
              <h2>Compétences</h2>
              {editingSection !== 'skills' ? (
                <button className="edit-btn" onClick={() => handleEdit('skills')}>
                  <FaEdit /> Modifier
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={() => handleSave('skills')}>
                    <FaSave /> Sauvegarder
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    <FaTimes /> Annuler
                  </button>
                </div>
              )}
            </div>
            <div className="section-content">
              <div className="field-group">
                <label>Compétences:</label>
                {editingSection === 'skills' ? (
                  <div className="skill-input-container">
                    <div className="skill-input-row">
                      <input
                        type="text"
                        placeholder="Tapez une compétence..."
                        value={newTechnicalSkill || ''}
                        onChange={(e) => setNewTechnicalSkill(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddSkill('skills', newTechnicalSkill);
                            setNewTechnicalSkill('');
                          }
                        }}
                        className="skill-input"
                      />
                      <button 
                        onClick={() => {
                          handleAddSkill('skills', newTechnicalSkill);
                          setNewTechnicalSkill('');
                        }}
                        disabled={!newTechnicalSkill?.trim()}
                        className="add-skill-btn"
                      >
                        Ajouter
                      </button>
                    </div>
                    <div className="skills-pills">
                      {(getArrayData(editedData, 'skills') || []).map((skill, index) => (
                        <div key={index} className="skill-pill-static">
                          {skill.trim()}
                          <button 
                            onClick={() => handleRemoveSkill('skills', index)}
                            className="remove-skill-btn"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="skills-pills">
                    {(getArrayData(structuredData, 'skills') || []).map((skill, index) => (
                      <div key={index} className="keyword-item">{skill.trim()}</div>
                    ))}
                  </div>
                )}
              </div>
              <div className="field-group">
                <label>Langues:</label>
                {editingSection === 'skills' ? (
                  <div className="skill-input-container">
                    <div className="skill-input-row">
                      <input
                        type="text"
                        placeholder="Tapez une langue..."
                        value={newLanguage || ''}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddSkill('languages', newLanguage);
                            setNewLanguage('');
                          }
                        }}
                        className="skill-input"
                      />
                      <button 
                        onClick={() => {
                          handleAddSkill('languages', newLanguage);
                          setNewLanguage('');
                        }}
                        disabled={!newLanguage?.trim()}
                        className="add-skill-btn"
                      >
                        Ajouter
                      </button>
                    </div>
                    <div className="skills-pills">
                      {(getArrayData(editedData, 'languages') || []).map((language, index) => (
                        <div key={index} className="skill-pill-static">
                          {typeof language === 'string' ? language : `${language.language} (${language.level})`}
                          <button 
                            onClick={() => handleRemoveSkill('languages', index)}
                            className="remove-skill-btn"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="skills-pills">
                    {(getArrayData(structuredData, 'languages') || []).map((language, index) => (
                      <div key={index} className="keyword-item">
                        {typeof language === 'string' ? language : `${language.language} (${language.level})`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section Toutes les informations de ChatGPT */}
        <div className="validation-section">
          <div className="section-header">
            <FaInfoCircle className="section-icon" />
            <h2>Toutes les informations extraites</h2>
          </div>
          <div className="section-content">
            {/* Afficher dynamiquement toutes les sections de ChatGPT */}
            {structuredData && Object.keys(structuredData).map((key) => {
              // Ignorer les clés système
              if (['raw_content', 'format', 'personal_info', 'education', 'experiences', 'skills'].includes(key)) {
                return null;
              }
              
              const value = structuredData[key];
              if (!value || (typeof value === 'string' && !value.trim())) {
                return null;
              }
              
              // Formater le titre de la section
              const sectionTitle = key
                .replace(/_/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase())
                .replace(/([A-Z])/g, ' $1')
                .trim();
              
              return (
                <div key={key} className="field-group">
                  <label>{sectionTitle}:</label>
                  <div className="text-content">
                    {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                  </div>
                </div>
              );
            })}

            {/* Contenu brut pour debug */}
            {getDataField(structuredData, 'raw_content') && (
              <div className="field-group">
                <label>Contenu brut de l'analyse:</label>
                <div className="text-content raw-content">
                  <pre>{getDataField(structuredData, 'raw_content')}</pre>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="validation-actions">
          <button className="frontpage-navbar-btn" onClick={handleValidationComplete}>
            <FaCheck /> Valider et continuer
          </button>
        </div>
      </div>
    </>
  );
}

// Export the main component
export default ResumeValidation;