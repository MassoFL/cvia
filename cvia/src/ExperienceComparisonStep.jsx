import React, { useState, useRef, useEffect } from 'react';
import './ResumeValidation.css';
import { ProgressSteps } from './components/ProgressSteps';
import AlignmentConfigPanel from './components/AlignmentConfigPanel';
import { FaDownload } from 'react-icons/fa';

function Navbar() {
  return (
    <nav className="frontpage-navbar">
      <div className="frontpage-navbar-left">CVIA</div>
      <div className="frontpage-navbar-right">
        <button className="frontpage-navbar-btn">Sign In / Sign Up</button>
      </div>
    </nav>
  );
}

// Utility function to format description text (no special formatting)
const formatDescription = (text) => {
  if (!text) return '';
  // Return text as-is without any special formatting
  return text;
};



export default function ExperienceComparisonStep({ 
  alignmentPairs, 
  onAlignmentPairsChange, 
  onContinue, 
  onBack, 
  isAligningExperiences = false,
  jobDescription = "",
  jobSummary = "",
  resumeSkills = null,
  jobSkills = null,
  validatedData = null
}) {
  const [editedPairs, setEditedPairs] = useState(alignmentPairs);
  // Array of refs for old cards
  const oldRefs = useRef([]);
  // Array of heights for each old card
  const [oldHeights, setOldHeights] = useState([]);
  // State for job skills editing
  const [isExtractingSkills, setIsExtractingSkills] = useState(false);
  const [editingSkills, setEditingSkills] = useState(false);
  const [editedJobSkills, setEditedJobSkills] = useState(null);
  
  // État pour les onglets de navigation
  const [activeTab, setActiveTab] = useState('personal');
  
  // État pour les informations personnelles éditables
  const [editedPersonalInfo, setEditedPersonalInfo] = useState({
    name: validatedData?.personal_information?.name || validatedData?.personal_info?.name || '',
    email: validatedData?.personal_information?.email || validatedData?.personal_info?.email || '',
    phone: validatedData?.personal_information?.phone || validatedData?.personal_info?.phone || '',
    address: validatedData?.personal_information?.address || validatedData?.personal_info?.address || '',
    website: '',
    linkedin: '',
    github: '',
    summary: ''
  });
  
  // État pour le titre du CV
  const [cvTitle, setCvTitle] = useState(editedPairs[0]?.new?.title || editedPairs[0]?.new?.position || '');
  
  // État pour le drag & drop
  const [draggedIndex, setDraggedIndex] = useState(null);
  
  // État pour gérer l'affichage de la page 2
  const [showPage2, setShowPage2] = useState(false);
  const page1Ref = useRef(null);
  
  // État pour le panel de configuration d'alignement
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [alignmentConfig, setAlignmentConfig] = useState({
    level: 'balanced',
    focus: ['keywords', 'responsibilities'],
    writingStyle: 'professional',
    customInstructions: '',
    preserveCompanyNames: true,
    preserveDates: true,
    enhanceAchievements: true
  });
  const [isApplyingAlignment, setIsApplyingAlignment] = useState(false);

  // Fonction pour appliquer la nouvelle configuration d'alignement
  const handleApplyAlignment = async (config) => {
    setIsApplyingAlignment(true);
    setShowConfigPanel(false);
    
    try {
      console.log('🔧 Applying alignment with config:', config);
      
      // Préparer les données pour l'API avec la nouvelle configuration
      const requestData = {
        job_description: jobDescription,
        experiences: alignmentPairs.map(pair => pair.old), // Utiliser les expériences originales
        skills: {},
        level: config.level,
        focus: config.focus,
        writing_style: config.writingStyle,
        custom_instructions: config.customInstructions,
        preserve_company_names: config.preserveCompanyNames,
        preserve_dates: config.preserveDates,
        enhance_achievements: config.enhanceAchievements
      };
      
      // Appeler l'API d'alignement avec la nouvelle configuration
      const response = await fetch('http://localhost:8000/align_experiences/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de l'alignement (${response.status}): ${errorText}`);
      }
      
      const alignData = await response.json();
      console.log('✅ New alignment applied:', alignData);
      
      // Reconstruire les paires d'alignement avec les nouvelles données
      const newPairs = alignmentPairs.map((pair, index) => {
        const alignment = alignData.alignments[index] || {};
        return {
          old: pair.old, // Garder l'expérience originale
          new: alignment.new || pair.old,
          score: 0, // Score supprimé
          comment: ''
        };
      });
      
      // Mettre à jour les paires d'alignement
      setEditedPairs(newPairs);
      if (onAlignmentPairsChange) {
        onAlignmentPairsChange(newPairs);
      }
      
      console.log('🎉 Alignment configuration applied successfully!');
      
    } catch (error) {
      console.error('❌ Error applying alignment:', error);
      alert(`Erreur lors de l'application de la configuration: ${error.message}`);
    } finally {
      setIsApplyingAlignment(false);
    }
  };

  useEffect(() => {
    // Measure heights after render
    const heights = oldRefs.current.map(ref => ref ? ref.offsetHeight : 0);
    setOldHeights(heights);
  }, [editedPairs]);

  const handleFieldChange = (index, field, value) => {
    const updated = editedPairs.map((pair, i) =>
      i === index ? { ...pair, new: { ...pair.new, [field]: value } } : pair
    );
    setEditedPairs(updated);
    if (onAlignmentPairsChange) onAlignmentPairsChange(updated);
  };

  const handleSkillsChange = (field, value) => {
    setEditedJobSkills(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fonction pour gérer les changements des informations personnelles
  const handlePersonalInfoChange = (field, value) => {
    setEditedPersonalInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fonction pour ajouter une nouvelle expérience
  const handleAddExperience = () => {
    const newExperience = {
      old: {
        title: '',
        company: '',
        start_date: '',
        end_date: '',
        description: ''
      },
      new: {
        title: '',
        company: '',
        start_date: '',
        end_date: '',
        description: ''
      },
      score: 0,
      comment: ''
    };
    
    const updatedPairs = [newExperience, ...editedPairs];
    setEditedPairs(updatedPairs);
    if (onAlignmentPairsChange) onAlignmentPairsChange(updatedPairs);
  };

  // Fonction pour supprimer une expérience
  const handleDeleteExperience = (index) => {
    const updatedPairs = editedPairs.filter((_, i) => i !== index);
    setEditedPairs(updatedPairs);
    if (onAlignmentPairsChange) onAlignmentPairsChange(updatedPairs);
  };

  // Fonctions pour le drag & drop
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const updatedPairs = [...editedPairs];
    const draggedItem = updatedPairs[draggedIndex];
    
    // Supprimer l'élément de sa position actuelle
    updatedPairs.splice(draggedIndex, 1);
    
    // L'insérer à la nouvelle position
    updatedPairs.splice(dropIndex, 0, draggedItem);
    
    setEditedPairs(updatedPairs);
    if (onAlignmentPairsChange) onAlignmentPairsChange(updatedPairs);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Function to create a summary paragraph from job description
  const createJobSummary = (description) => {
    if (!description) return "";
    
    // Remove extra whitespace and line breaks
    const cleanDescription = description.replace(/\s+/g, ' ').trim();
    
    // If description is already short, return as is
    if (cleanDescription.length <= 200) {
      return cleanDescription;
    }
    
    // Take first 200 characters and try to end at a sentence
    let summary = cleanDescription.substring(0, 200);
    
    // Try to find a good sentence ending
    const lastPeriod = summary.lastIndexOf('.');
    const lastExclamation = summary.lastIndexOf('!');
    const lastQuestion = summary.lastIndexOf('?');
    
    const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
    
    if (lastSentenceEnd > 150) { // Only cut at sentence if it's not too short
      summary = summary.substring(0, lastSentenceEnd + 1);
    }
    
    return summary;
  };

  // Function to clean special characters
  const cleanText = (text) => {
    if (!text) return "";
    return text
      .replace(/[?]/g, "'")  // Fix apostrophes
      .replace(/[?]/g, '"')  // Fix quotes
      .replace(/[?]/g, '-')  // Fix dashes
      .replace(/[?]/g, 'é')  // Fix é
      .replace(/[?]/g, 'è')  // Fix è
      .replace(/[?]/g, 'à')  // Fix à
      .replace(/[?]/g, 'ç'); // Fix ç
  };



  // Initialize edited job skills when jobSkills prop changes
  useEffect(() => {
    if (jobSkills && !editedJobSkills) {
      setEditedJobSkills(jobSkills);
    }
  }, [jobSkills, editedJobSkills]);

  // Détecter si le contenu dépasse la première page
  useEffect(() => {
    const checkContentOverflow = () => {
      if (page1Ref.current) {
        // Créer un élément temporaire pour mesurer le contenu sans contraintes
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.visibility = 'hidden';
        tempDiv.style.width = '210mm';
        tempDiv.style.padding = '8mm 15mm 15mm 12mm';
        tempDiv.style.fontSize = '11pt';
        tempDiv.style.lineHeight = '1.4';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        tempDiv.innerHTML = page1Ref.current.innerHTML;
        
        document.body.appendChild(tempDiv);
        const contentHeight = tempDiv.offsetHeight;
        document.body.removeChild(tempDiv);
        
        // Hauteur A4 en pixels (297mm = ~1122px à 96 DPI)
        const pageHeight = 1122;
        
        setShowPage2(contentHeight > pageHeight);
      }
    };

    // Vérifier après chaque changement de contenu
    const timer = setTimeout(checkContentOverflow, 300);
    return () => clearTimeout(timer);
  }, [editedPersonalInfo, cvTitle, editedPairs, editedJobSkills, validatedData]);

  // Use AI-generated summary if available, otherwise create a summary from the full description
  const displaySummary = jobSummary && jobSummary.trim() !== '' 
    ? cleanText(jobSummary) 
    : cleanText(createJobSummary(jobDescription));

  // Fonction pour télécharger le PDF
  const handleDownloadPDF = async () => {
    try {
      // Récupérer les données nécessaires depuis localStorage
      const jobSummaryData = JSON.parse(localStorage.getItem('job_summary') || '{}');
      const selectedTemplate = JSON.parse(localStorage.getItem('selected_template') || '{}');
      
      if (!selectedTemplate.id) {
        alert('Aucun template sélectionné. Veuillez retourner à l\'étape précédente.');
        return;
      }

      // Préparer les données pour la génération PDF avec les données éditées
      const pdfPayload = {
        template_id: selectedTemplate.id,
        user_data: {
          name: editedPersonalInfo.name || '',
          email: editedPersonalInfo.email || '',
          phone: editedPersonalInfo.phone || '',
          location: editedPersonalInfo.address || '',
          linkedin: editedPersonalInfo.linkedin || '',
          website: editedPersonalInfo.website || '',
          github: editedPersonalInfo.github || '',
          summary: editedPersonalInfo.summary || '',
          title: cvTitle || '',
          experiences: editedPairs.map(pair => pair.new) || [],
          education: validatedData?.education || [],
          skills: editedJobSkills || jobSkills || {},
        },
        job_description: jobDescription || '',
        job_summary: jobSummaryData
      };

      console.log('📋 Generating PDF with data:', pdfPayload);

      // Appeler l'API de génération de PDF
      const response = await fetch('http://localhost:8000/generate_pdf/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pdfPayload)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const pdfData = await response.json();
      console.log('✅ PDF generated successfully:', pdfData);

      if (pdfData.success && pdfData.pdf_file) {
        // Télécharger le PDF
        const downloadResponse = await fetch(`http://localhost:8000/download_pdf/${pdfData.pdf_file.cv_id}`);
        
        if (downloadResponse.ok) {
          const blob = await downloadResponse.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `CV_${editedPersonalInfo.name || 'optimise'}_${selectedTemplate.name}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          
          console.log('✅ PDF downloaded successfully');
        } else {
          throw new Error('Échec du téléchargement du PDF');
        }
      } else {
        throw new Error('Échec de la génération du PDF');
      }
    } catch (error) {
      console.error('❌ Error downloading PDF:', error);
      alert(`Erreur lors du téléchargement du PDF: ${error.message}`);
    }
  };

  return (
    <div className="frontpage-bg">
      <Navbar />
      <div className="bottom-progress-steps">
        <ProgressSteps currentStepIndex={3} />
      </div>
      <div className="validation-content">
        <div className="validation-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0 }}>Alignement des expériences</h1>
          
          {/* Bouton de configuration à droite du titre */}
          <button 
            onClick={() => setShowConfigPanel(true)}
            disabled={isApplyingAlignment}
            style={{
              background: 'none',
              border: 'none',
              color: isApplyingAlignment ? '#999' : '#00ff99',
              fontSize: '20px',
              cursor: isApplyingAlignment ? 'not-allowed' : 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => {
              if (!isApplyingAlignment) {
                e.target.style.color = '#00cc7a';
                e.target.style.background = 'rgba(0, 255, 153, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isApplyingAlignment) {
                e.target.style.color = '#00ff99';
                e.target.style.background = 'none';
              }
            }}
            title={isApplyingAlignment ? 'Application en cours...' : 'Configurer les paramètres d\'alignement'}
          >
            {isApplyingAlignment ? '⏳' : '⚙️'}
          </button>
        </div>
        

        
        {isAligningExperiences && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.9)',
            padding: '24px 32px',
            borderRadius: '16px',
            border: '2px solid #00ff99',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            backdropFilter: 'blur(8px)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid #00ff99',
              borderTop: '3px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{ color: '#00ff99', fontWeight: 600, fontSize: '16px' }}>
              Génération des expériences alignées...
            </div>
            <div style={{ color: '#ccc', fontSize: '14px', textAlign: 'center' }}>
              L'IA analyse vos expériences et les adapte au poste
            </div>
          </div>
        )}
        
        {/* Nouvelle structure : Données éditables à gauche, Aperçu CV à droite */}
        <div style={{ display: 'flex', gap: 40, width: '100%', maxWidth: '1400px', alignItems: 'flex-start' }}>
          
          {/* Colonne de gauche : Interface avec onglets */}
          <div style={{ flex: 1, minWidth: 500, maxWidth: 600 }}>
            
            {/* Barre d'onglets */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              marginBottom: 20,
              overflowX: 'auto'
            }}>
              {[
                { id: 'personal', label: 'Personnel' },
                { id: 'title', label: 'Titre' },
                { id: 'experience', label: 'Expérience' },
                { id: 'education', label: 'Formation' },
                { id: 'skills', label: 'Compétences' },
                { id: 'languages', label: 'Langues' },
                { id: 'projects', label: 'Projets' },
                { id: 'certifications', label: 'Certifications' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: activeTab === tab.id ? 'rgba(0, 255, 153, 0.1)' : 'transparent',
                    color: activeTab === tab.id ? '#00ff99' : '#ccc',
                    border: 'none',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: activeTab === tab.id ? '600' : '400',
                    borderBottom: activeTab === tab.id ? '2px solid #00ff99' : '2px solid transparent',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contenu des onglets */}
            <div className="validation-section">
              
              {/* Onglet Titre CV */}
              {activeTab === 'title' && (
                <div className="section-content">
                  <div className="field-group">
                    <label>Titre du poste recherché</label>
                    <input
                      type="text"
                      value={cvTitle}
                      onChange={e => setCvTitle(e.target.value)}
                      style={{ width: 'calc(100% - 20px)', maxWidth: '450px' }}
                      placeholder="Développeur Full Stack Senior"
                    />
                  </div>
                  <div style={{ 
                    marginTop: 16, 
                    padding: 12, 
                    background: 'rgba(0, 255, 153, 0.1)', 
                    border: '1px solid rgba(0, 255, 153, 0.3)', 
                    borderRadius: 4,
                    fontSize: 12,
                    color: 'rgba(255, 255, 255, 0.8)'
                  }}>
                    💡 Si ce champ est vide, aucun titre ne s'affichera sur votre CV. Sinon, le titre apparaîtra en évidence.
                  </div>
                </div>
              )}

              {/* Onglet Personal */}
              {activeTab === 'personal' && (
                <div className="section-content">
                  <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                    <div className="field-group" style={{ flex: 1 }}>
                      <label>Nom complet</label>
                      <input
                        type="text"
                        value={editedPersonalInfo.name}
                        onChange={e => handlePersonalInfoChange('name', e.target.value)}
                        style={{ width: 'calc(100% - 20px)', maxWidth: '200px' }}
                        placeholder=""
                      />
                    </div>
                    <div className="field-group" style={{ flex: 1 }}>
                      <label>Email</label>
                      <input
                        type="email"
                        value={editedPersonalInfo.email}
                        onChange={e => handlePersonalInfoChange('email', e.target.value)}
                        style={{ width: 'calc(100% - 20px)', maxWidth: '200px' }}
                        placeholder=""
                      />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                    <div className="field-group" style={{ flex: 1 }}>
                      <label>Téléphone</label>
                      <input
                        type="tel"
                        value={editedPersonalInfo.phone}
                        onChange={e => handlePersonalInfoChange('phone', e.target.value)}
                        style={{ width: 'calc(100% - 20px)', maxWidth: '200px' }}
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>
                    <div className="field-group" style={{ flex: 1 }}>
                      <label>Localisation</label>
                      <input
                        type="text"
                        value={editedPersonalInfo.address}
                        onChange={e => handlePersonalInfoChange('address', e.target.value)}
                        style={{ width: 'calc(100% - 20px)', maxWidth: '200px' }}
                        placeholder="Paris, France"
                      />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                    <div className="field-group" style={{ flex: 1 }}>
                      <label>Site web (optionnel)</label>
                      <input
                        type="url"
                        value={editedPersonalInfo.website}
                        onChange={e => handlePersonalInfoChange('website', e.target.value)}
                        style={{ width: 'calc(100% - 20px)', maxWidth: '200px' }}
                        placeholder=""
                      />
                    </div>
                    <div className="field-group" style={{ flex: 1 }}>
                      <label>LinkedIn (optionnel)</label>
                      <input
                        type="url"
                        value={editedPersonalInfo.linkedin}
                        onChange={e => handlePersonalInfoChange('linkedin', e.target.value)}
                        style={{ width: 'calc(100% - 20px)', maxWidth: '200px' }}
                        placeholder=""
                      />
                    </div>
                  </div>
                  
                  <div className="field-group" style={{ marginBottom: 12 }}>
                    <label>GitHub (optionnel)</label>
                    <input
                      type="url"
                      value={editedPersonalInfo.github}
                      onChange={e => handlePersonalInfoChange('github', e.target.value)}
                      style={{ width: 'calc(100% - 20px)', maxWidth: '400px' }}
                      placeholder=""
                    />
                  </div>
                  
                  <div className="field-group">
                    <label>Résumé professionnel</label>
                    <textarea
                      value={editedPersonalInfo.summary}
                      onChange={e => handlePersonalInfoChange('summary', e.target.value)}
                      rows={4}
                      style={{ width: 'calc(100% - 20px)', maxWidth: '400px', minHeight: 100, resize: 'vertical' }}
                      placeholder=""
                    />
                  </div>
                </div>
              )}

              {/* Onglet Experience */}
              {activeTab === 'experience' && (
                <div className="section-content">
                  {/* Bouton pour ajouter une expérience */}
                  <div style={{ marginBottom: 12, marginTop: 0, textAlign: 'center' }}>
                    <button
                      onClick={handleAddExperience}
                      style={{
                        background: 'linear-gradient(135deg, #00ff99, #00bfff)',
                        color: '#000',
                        border: 'none',
                        borderRadius: 0,
                        padding: '6px 16px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        margin: '0 auto'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 15px rgba(0, 255, 153, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      ➕ Ajouter une expérience
                    </button>
                  </div>

                  {editedPairs.map((pair, idx) => (
                    <div 
                      key={idx} 
                      className="experience-item" 
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, idx)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, idx)}
                      onDragEnd={handleDragEnd}
                      style={{ 
                        marginBottom: 12, 
                        padding: 12, 
                        background: draggedIndex === idx ? 'rgba(0, 255, 153, 0.1)' : 'rgba(255, 255, 255, 0.05)', 
                        border: draggedIndex === idx ? '1px solid #00ff99' : '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'move',
                        opacity: draggedIndex === idx ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                      }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <h4 style={{ color: '#fff', margin: 0, fontSize: '16px' }}>
                            {pair.new.title || pair.new.position || `Expérience ${idx + 1}`}
                          </h4>
                        </div>
                        {editedPairs.length > 1 && (
                          <button
                            onClick={() => handleDeleteExperience(idx)}
                            style={{
                              background: 'rgba(255, 107, 107, 0.2)',
                              color: '#ff6b6b',
                              border: '1px solid rgba(255, 107, 107, 0.3)',
                              borderRadius: 0,
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = 'rgba(255, 107, 107, 0.3)';
                              e.target.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'rgba(255, 107, 107, 0.2)';
                              e.target.style.transform = 'scale(1)';
                            }}
                          >
                            🗑️ Supprimer
                          </button>
                        )}
                      </div>
                      
                      <div className="field-group">
                        <label>Poste :</label>
                        <input
                          type="text"
                          value={pair.new.title || pair.new.position || ''}
                          onChange={e => handleFieldChange(idx, 'title', e.target.value)}
                          style={{ width: 'calc(100% - 20px)' }}
                        />
                      </div>
                      
                      <div className="field-group">
                        <label>Entreprise :</label>
                        <input
                          type="text"
                          value={pair.new.company || ''}
                          onChange={e => handleFieldChange(idx, 'company', e.target.value)}
                          style={{ width: 'calc(100% - 20px)' }}
                        />
                      </div>
                      
                      <div style={{ display: 'flex', gap: 10 }}>
                        <div className="field-group" style={{ flex: 1 }}>
                          <label>Date de début :</label>
                          <input
                            type="text"
                            value={pair.new.start_date || ''}
                            onChange={e => handleFieldChange(idx, 'start_date', e.target.value)}
                            style={{ width: 'calc(100% - 20px)' }}
                          />
                        </div>
                        <div className="field-group" style={{ flex: 1 }}>
                          <label>Date de fin :</label>
                          <input
                            type="text"
                            value={pair.new.end_date || ''}
                            onChange={e => handleFieldChange(idx, 'end_date', e.target.value)}
                            style={{ width: 'calc(100% - 20px)' }}
                          />
                        </div>
                      </div>
                      
                      <div className="field-group">
                        <label>Description :</label>
                        <textarea
                          value={pair.new.description || ''}
                          onChange={e => handleFieldChange(idx, 'description', e.target.value)}
                          rows={4}
                          style={{ width: 'calc(100% - 20px)', minHeight: 100, resize: 'vertical' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Onglet Education */}
              {activeTab === 'education' && (
                <div className="section-content">
                  {validatedData?.education && validatedData.education.length > 0 ? (
                    validatedData.education.map((edu, idx) => (
                      <div key={idx} className="experience-item" style={{ marginBottom: 16, padding: 16, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <h4 style={{ color: '#fff', margin: '0 0 10px 0', fontSize: '16px' }}>Formation {idx + 1}</h4>
                        
                        <div className="field-group">
                          <label>Diplôme :</label>
                          <input
                            type="text"
                            value={edu.degree || ''}
                            style={{ width: 'calc(100% - 20px)', maxWidth: '400px' }}
                          />
                        </div>
                        
                        <div className="field-group">
                          <label>Institution :</label>
                          <input
                            type="text"
                            value={edu.institution || ''}
                            style={{ width: 'calc(100% - 20px)', maxWidth: '400px' }}
                          />
                        </div>
                        
                        <div style={{ display: 'flex', gap: 10 }}>
                          <div className="field-group" style={{ flex: 1 }}>
                            <label>Date de début :</label>
                            <input
                              type="text"
                              value={edu.start_date || ''}
                              style={{ width: 'calc(100% - 20px)', maxWidth: '180px' }}
                            />
                          </div>
                          <div className="field-group" style={{ flex: 1 }}>
                            <label>Date de fin :</label>
                            <input
                              type="text"
                              value={edu.end_date || ''}
                              style={{ width: 'calc(100% - 20px)', maxWidth: '180px' }}
                            />
                          </div>
                        </div>
                        
                        {edu.description && (
                          <div className="field-group">
                            <label>Description :</label>
                            <textarea
                              value={edu.description || ''}
                              rows={3}
                              style={{ width: 'calc(100% - 20px)', maxWidth: '400px', resize: 'vertical' }}
                            />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', color: '#666', padding: 40 }}>
                      <p>Aucune formation trouvée dans vos données</p>
                    </div>
                  )}
                </div>
              )}

              {/* Onglet Skills */}
              {activeTab === 'skills' && jobSkills && (
                <div className="section-content">
                  <div className="field-group">
                    <label>Compétences techniques :</label>
                    <textarea
                      value={(editedJobSkills?.technical_skills || jobSkills?.technical_skills || []).join(', ')}
                      onChange={(e) => handleSkillsChange('technical_skills', e.target.value.split(', ').filter(s => s.trim()))}
                      rows={3}
                      style={{ width: 'calc(100% - 20px)', maxWidth: '450px' }}
                      placeholder="React, Node.js, Python, SQL..."
                    />
                  </div>
                  <div className="field-group">
                    <label>Compétences générales :</label>
                    <textarea
                      value={(editedJobSkills?.soft_skills || jobSkills?.soft_skills || []).join(', ')}
                      onChange={(e) => handleSkillsChange('soft_skills', e.target.value.split(', ').filter(s => s.trim()))}
                      rows={3}
                      style={{ width: 'calc(100% - 20px)', maxWidth: '450px' }}
                      placeholder="Leadership, Communication, Gestion de projet..."
                    />
                  </div>
                </div>
              )}

              {/* Onglet Languages */}
              {activeTab === 'languages' && jobSkills && (
                <div className="section-content">
                  <div className="field-group">
                    <label>Langues :</label>
                    <textarea
                      value={(editedJobSkills?.languages || jobSkills?.languages || []).join(', ')}
                      onChange={(e) => handleSkillsChange('languages', e.target.value.split(', ').filter(s => s.trim()))}
                      rows={4}
                      style={{ width: 'calc(100% - 20px)', maxWidth: '450px' }}
                      placeholder="Français (natif), Anglais (courant), Espagnol (intermédiaire)..."
                    />
                  </div>
                </div>
              )}

              {/* Onglet Projects */}
              {activeTab === 'projects' && (
                <div className="section-content">
                  <div style={{ textAlign: 'center', color: '#666', padding: 40 }}>
                    <p>Section Projets - À implémenter</p>
                  </div>
                </div>
              )}

              {/* Onglet Certifications */}
              {activeTab === 'certifications' && (
                <div className="section-content">
                  <div style={{ textAlign: 'center', color: '#666', padding: 40 }}>
                    <p>Section Certifications - À implémenter</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Colonne de droite : Aperçu CV format A4 */}
          <div style={{ flex: 1, minWidth: 700, maxWidth: 1000, position: 'sticky', top: 20 }}>
            {/* Conteneur pour toutes les pages */}
            <div>
              {/* Page 1 */}
              <div 
                ref={page1Ref}
                style={{
                  background: '#fff',
                  width: '210mm',
                  height: '297mm',
                  maxWidth: '100%',
                  transform: 'scale(0.8)',
                  transformOrigin: 'top left',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  padding: '8mm 15mm 15mm 12mm',
                  fontSize: '11pt',
                  lineHeight: 1.4,
                  color: '#333',
                  fontFamily: 'Arial, sans-serif',
                  marginBottom: '20px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
              
              {/* En-tête avec informations personnelles */}
              <div style={{ marginBottom: '8mm' }}>
                <h1 style={{ 
                  fontSize: '18pt', 
                  fontWeight: 'bold', 
                  margin: '0 0 3mm 0',
                  color: '#333',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {editedPersonalInfo.name || 'PRÉNOM NOM'}
                </h1>
                
                <div style={{ fontSize: '10pt', color: '#666', lineHeight: 1.2 }}>
                  <div>{editedPersonalInfo.email || 'email@exemple.com'}</div>
                  <div>{editedPersonalInfo.phone || '+33 X XX XX XX XX'}</div>
                  <div>{editedPersonalInfo.address || 'Adresse, Ville'}</div>
                  {editedPersonalInfo.website && <div>Site web: {editedPersonalInfo.website}</div>}
                  {editedPersonalInfo.linkedin && <div>LinkedIn: {editedPersonalInfo.linkedin}</div>}
                  {editedPersonalInfo.github && <div>GitHub: {editedPersonalInfo.github}</div>}
                </div>
              </div>

              {/* Titre du poste recherché */}
              {cvTitle && (
                <div style={{ marginBottom: '4mm', textAlign: 'center' }}>
                  <h2 style={{ 
                    fontSize: '12pt', 
                    fontWeight: 'bold', 
                    margin: 0,
                    color: '#000',
                    textTransform: 'uppercase',
                    borderTop: '1px solid #ccc',
                    borderBottom: '1px solid #ccc',
                    padding: '2mm 0'
                  }}>
                    {cvTitle}
                  </h2>
                </div>
              )}

              {/* Résumé professionnel */}
              {editedPersonalInfo.summary && (
                <div style={{ marginBottom: '6mm' }}>
                  <h3 style={{ 
                    fontSize: '12pt', 
                    fontWeight: 'bold', 
                    margin: '0 0 2mm 0',
                    color: '#333',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid #ccc',
                    paddingBottom: '1mm'
                  }}>
                    RÉSUMÉ PROFESSIONNEL
                  </h3>
                  <div style={{ fontSize: '10pt', lineHeight: 1.4, textAlign: 'justify' }}>
                    {editedPersonalInfo.summary}
                  </div>
                </div>
              )}

              {/* Formation */}
              {validatedData?.education && validatedData.education.length > 0 && (
                <div style={{ marginBottom: '8mm' }}>
                  <h3 style={{ 
                    fontSize: '12pt', 
                    fontWeight: 'bold', 
                    margin: '0 0 3mm 0',
                    color: '#333',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid #ccc',
                    paddingBottom: '1mm'
                  }}>
                    FORMATION
                  </h3>
                  {validatedData.education.map((edu, idx) => (
                    <div key={idx} style={{ marginBottom: '3mm' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '10pt' }}>
                        {edu.degree || 'Diplôme'} - {edu.institution || 'Institution'}
                      </div>
                      <div style={{ fontSize: '9pt', color: '#666', fontStyle: 'italic' }}>
                        {edu.start_date || 'Année'} - {edu.end_date || 'Année'}
                      </div>
                      {edu.description && (
                        <div style={{ fontSize: '9pt', marginTop: '1mm' }}>
                          {edu.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Expériences Professionnelles */}
              <div style={{ marginBottom: '8mm' }}>
                <h3 style={{ 
                  fontSize: '12pt', 
                  fontWeight: 'bold', 
                  margin: '0 0 3mm 0',
                  color: '#333',
                  textTransform: 'uppercase',
                  borderBottom: '1px solid #ccc',
                  paddingBottom: '1mm'
                }}>
                  EXPÉRIENCES PROFESSIONNELLES
                </h3>
                {editedPairs.map((pair, idx) => (
                  <div key={idx} style={{ marginBottom: '4mm' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '10pt' }}>
                      {pair.new.title || pair.new.position || 'Poste'}
                    </div>
                    <div style={{ fontSize: '9pt', color: '#666', fontStyle: 'italic', marginBottom: '1mm' }}>
                      {pair.new.company || 'Entreprise'} • {pair.new.start_date || 'Date'} - {pair.new.end_date || 'Date'}
                    </div>
                    <div style={{ fontSize: '9pt', lineHeight: 1.3 }}>
                      {pair.new.description || 'Description de l\'expérience'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Compétences */}
              {jobSkills && (
                <div style={{ marginBottom: '8mm' }}>
                  <h3 style={{ 
                    fontSize: '12pt', 
                    fontWeight: 'bold', 
                    margin: '0 0 3mm 0',
                    color: '#333',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid #ccc',
                    paddingBottom: '1mm'
                  }}>
                    COMPÉTENCES
                  </h3>
                  <div style={{ fontSize: '9pt' }}>
                    {(editedJobSkills?.technical_skills || jobSkills?.technical_skills || []).length > 0 && (
                      <div style={{ marginBottom: '2mm' }}>
                        <strong>Techniques:</strong> {(editedJobSkills?.technical_skills || jobSkills?.technical_skills || []).join(', ')}
                      </div>
                    )}
                    {(editedJobSkills?.soft_skills || jobSkills?.soft_skills || []).length > 0 && (
                      <div style={{ marginBottom: '2mm' }}>
                        <strong>Générales:</strong> {(editedJobSkills?.soft_skills || jobSkills?.soft_skills || []).join(', ')}
                      </div>
                    )}
                    {(editedJobSkills?.languages || jobSkills?.languages || []).length > 0 && (
                      <div style={{ marginBottom: '2mm' }}>
                        <strong>Langues:</strong> {(editedJobSkills?.languages || jobSkills?.languages || []).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Loisirs */}
              {validatedData?.interests && validatedData.interests.length > 0 && (
                <div>
                  <h3 style={{ 
                    fontSize: '12pt', 
                    fontWeight: 'bold', 
                    margin: '0 0 3mm 0',
                    color: '#333',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid #ccc',
                    paddingBottom: '1mm'
                  }}>
                    CENTRES D'INTÉRÊT
                  </h3>
                  <div style={{ fontSize: '9pt' }}>
                    {Array.isArray(validatedData.interests) 
                      ? validatedData.interests.join(', ')
                      : validatedData.interests
                    }
                  </div>
                </div>
              )}
              </div>

              {/* Page 2 - Affichée seulement si le contenu dépasse */}
              {showPage2 && (
                <div style={{
                  background: '#fff',
                  width: '210mm',
                  height: '297mm',
                  maxWidth: '100%',
                  transform: 'scale(0.8)',
                  transformOrigin: 'top left',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  padding: '8mm 15mm 15mm 12mm',
                  fontSize: '11pt',
                  lineHeight: 1.4,
                  color: '#333',
                  fontFamily: 'Arial, sans-serif',
                  marginBottom: '20px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {/* En-tête simplifié pour la page 2 */}
                  <div style={{ marginBottom: '8mm', textAlign: 'center' }}>
                    <h1 style={{ 
                      fontSize: '14pt', 
                      fontWeight: 'bold', 
                      margin: '0 0 2mm 0',
                      color: '#333',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {editedPersonalInfo.name || 'PRÉNOM NOM'} - Page 2
                    </h1>
                  </div>

                  {/* Contenu de débordement pour la page 2 */}
                  <div style={{ fontSize: '10pt', color: '#666' }}>
                    <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
                      Contenu supplémentaire du CV (suite de la page 1)
                    </p>
                    
                    {/* Ici on pourrait ajouter le contenu qui déborde de la page 1 */}
                    {/* Pour l'instant, on affiche juste un message indicatif */}
                    <div style={{ marginTop: '20mm', textAlign: 'center' }}>
                      <p>Cette page s'affiche automatiquement quand le contenu dépasse la première page.</p>
                      <p>Le contenu de débordement sera affiché ici dans une future version.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>


        
        <div className="validation-actions" style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32 }}>
          <button className="frontpage-navbar-btn" type="button" onClick={onBack}>⬅ Retour</button>
          <button 
            className="frontpage-navbar-btn" 
            type="button" 
            onClick={handleDownloadPDF}
            style={{ 
              background: '#27ae60',
              color: 'white'
            }}
          >
            <FaDownload style={{ marginRight: '8px' }} /> Télécharger PDF
          </button>
          <button className="frontpage-navbar-btn" type="button" onClick={() => onContinue(editedPairs)}>Valider et continuer</button>
        </div>
      </div>

      {/* Overlay de chargement pendant l'application de l'alignement */}
      {isApplyingAlignment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: '120px',
          zIndex: 9998,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            background: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            maxWidth: '400px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '20px',
              animation: 'spin 2s linear infinite'
            }}>
              ⚙️
            </div>
            <h3 style={{
              color: '#00ff99',
              margin: '0 0 16px 0',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Application de la configuration
            </h3>
            <p style={{
              color: '#ccc',
              margin: '0 0 20px 0',
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              L'IA adapte vos expériences selon les paramètres choisis...
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '20px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#00ff99',
                animation: 'pulse 1.5s ease-in-out infinite'
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#00ff99',
                animation: 'pulse 1.5s ease-in-out infinite 0.2s'
              }}></div>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#00ff99',
                animation: 'pulse 1.5s ease-in-out infinite 0.4s'
              }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Panel de configuration d'alignement */}
      <AlignmentConfigPanel
        isOpen={showConfigPanel}
        onClose={() => setShowConfigPanel(false)}
        currentConfig={alignmentConfig}
        onConfigChange={setAlignmentConfig}
        onApply={handleApplyAlignment}
        isApplying={isApplyingAlignment}
      />
    </div>
  );
} 