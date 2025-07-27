import React, { useState, useRef, useEffect } from 'react';
import './ResumeValidation.css';
import { ProgressSteps } from './FrontPage';

// Utility function to format description text (no special formatting)
const formatDescription = (text) => {
  if (!text) return '';
  // Return text as-is without any special formatting
  return text;
};

function ScoreBadge({ score }) {
  const color = score === 0 ? '#ccc' : score > 80 ? '#4caf50' : score > 50 ? '#ffc107' : '#ff9800';
  return (
    <span style={{
      display: 'inline-block',
      minWidth: 38,
      padding: '4px 10px',
      borderRadius: 16,
      background: color,
      color: '#111',
      fontWeight: 600,
      fontSize: 14,
      marginLeft: 8
    }}>
      {score === 0 ? '0%' : `${score}%`}
    </span>
  );
}

export default function ExperienceComparisonStep({ 
  alignmentPairs, 
  onAlignmentPairsChange, 
  onContinue, 
  onBack, 
  isAligningExperiences = false,
  jobDescription = "",
  jobSummary = "",
  resumeSkills = null,
  jobSkills = null
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

  // Use AI-generated summary if available, otherwise create a summary from the full description
  const displaySummary = jobSummary && jobSummary.trim() !== '' 
    ? cleanText(jobSummary) 
    : cleanText(createJobSummary(jobDescription));

  return (
    <div className="frontpage-bg">
      <div className="bottom-progress-steps">
        <ProgressSteps currentStepIndex={3} />
      </div>
      <div className="validation-content">
        <div className="validation-header">
          <h1>Comparaison des expériences</h1>
        </div>
        
        {/* Job Description Summary */}
        {jobDescription && (
          <div style={{
            textAlign: 'center',
            marginBottom: 32,
            padding: '0 20px'
          }}>
            <div style={{
              color: '#00ff99',
              fontSize: 16,
              lineHeight: 1.6,
              fontWeight: 400,
              fontStyle: 'italic'
            }}>
              {displaySummary}
            </div>
          </div>
        )}
        
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
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {/* Main content with experiences */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {editedPairs.map((pair, idx) => (
              <div
                key={idx}
                style={{ display: 'flex', gap: 56, width: '100%', justifyContent: 'center', alignItems: 'stretch' }}
              >
                {/* Old (read-only) experience */}
                <div style={{ flex: 1, minWidth: 420, maxWidth: 700, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div
                    className="validation-section"
                    style={{ marginBottom: 0, opacity: 0.8, height: '100%', display: 'flex', flexDirection: 'column' }}
                    ref={el => (oldRefs.current[idx] = el)}
                  >
                    <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h3 style={{ color: '#fff', textAlign: 'center', margin: 0, flex: 1 }}>Expérience {idx + 1}</h3>
                      <ScoreBadge score={pair.score} />
                    </div>
                    <div className="section-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div className="field-group">
                        <label>Entreprise :</label>
                        <span>{pair.old.company || 'Non spécifié'}</span>
                      </div>
                      <div className="field-group">
                        <label>Poste :</label>
                        <span>{pair.old.position || 'Non spécifié'}</span>
                      </div>
                      <div className="field-group">
                        <label>Date de début :</label>
                        <span>{pair.old.start_date || 'Non spécifié'}</span>
                      </div>
                      <div className="field-group">
                        <label>Date de fin :</label>
                        <span>{pair.old.end_date || 'Non spécifié'}</span>
                      </div>
                      <div className="field-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <label>Description :</label>
                        <span style={{ flex: 1, overflowY: 'auto', whiteSpace: 'pre-line' }}>{pair.old.description || 'Non spécifié'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* New (editable) experience */}
                <div style={{ flex: 1, minWidth: 420, maxWidth: 700, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div
                    className="validation-section"
                    style={{ marginBottom: 0, height: oldHeights[idx] ? oldHeights[idx] : '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h3 style={{ color: '#fff', textAlign: 'center', margin: 0, flex: 1 }}>Expérience {idx + 1}</h3>
                      <ScoreBadge score={pair.score} />
                    </div>
                    <div className="section-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div className="field-group">
                        <label>Entreprise :</label>
                        <span>{pair.old.company || 'Non spécifié'}</span>
                      </div>
                      <div className="field-group">
                        <label>Poste :</label>
                        {pair.score === 0 ? (
                          <span>{pair.old.position || 'Non spécifié'}</span>
                        ) : (
                          <input
                            type="text"
                            value={pair.new.position || ''}
                            onChange={e => handleFieldChange(idx, 'position', e.target.value)}
                          />
                        )}
                      </div>
                      <div className="field-group">
                        <label>Date de début :</label>
                        <span>{pair.old.start_date || 'Non spécifié'}</span>
                      </div>
                      <div className="field-group">
                        <label>Date de fin :</label>
                        <span>{pair.old.end_date || 'Non spécifié'}</span>
                      </div>
                      <div className="field-group" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <label>Description :</label>
                        {pair.score === 0 ? (
                          <span style={{ flex: 1, overflowY: 'auto', whiteSpace: 'pre-line', height: '100%' }}>{pair.old.description || 'Non spécifié'}</span>
                        ) : (
                          <div style={{ 
                            flex: 1, 
                            minHeight: 120, 
                            height: '100%', 
                            overflowY: 'auto',
                            whiteSpace: 'pre-line',
                            padding: '8px 12px',
                            border: '1px solid #444',
                            borderRadius: '4px',
                            background: '#1a1a1a',
                            color: '#fff',
                            fontSize: '14px',
                            lineHeight: '1.5'
                          }}
                          dangerouslySetInnerHTML={{ 
                            __html: formatDescription(pair.new.description || '') 
                          }}
                          contentEditable
                          onBlur={(e) => handleFieldChange(idx, 'description', e.target.innerText)}
                          suppressContentEditableWarning={true}
                        />
                        )}
                      </div>
                      {pair.comment && (
                        <div style={{ 
                          color: pair.score === 0 ? '#ff9800' : '#7fffd4', 
                          fontWeight: 500, 
                          marginTop: 8,
                          fontSize: 13,
                          lineHeight: 1.4,
                          fontStyle: 'italic'
                        }}>
                          {pair.comment}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Comparison Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'flex', gap: 56, width: '100%', justifyContent: 'center', alignItems: 'stretch' }}>
            {/* Resume Skills (read-only) */}
            <div style={{ flex: 1, minWidth: 420, maxWidth: 700, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="validation-section" style={{ marginBottom: 0, opacity: 0.8, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ color: '#fff', textAlign: 'center', margin: 0, flex: 1 }}>Compétences du CV</h3>
                </div>
                <div className="section-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="field-group">
                    <label>Compétences techniques :</label>
                    <span>{(resumeSkills?.technical_skills || []).join(', ') || 'Non spécifié'}</span>
                  </div>
                  <div className="field-group">
                    <label>Compétences générales :</label>
                    <span>{(resumeSkills?.soft_skills || []).join(', ') || 'Non spécifié'}</span>
                  </div>
                  <div className="field-group">
                    <label>Langues :</label>
                    <span>{(resumeSkills?.languages || []).join(', ') || 'Non spécifié'}</span>
                  </div>
                  <div className="field-group">
                    <label>Certifications :</label>
                    <span>{(resumeSkills?.certifications || []).join(', ') || 'Non spécifié'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Skills (editable) */}
            <div style={{ flex: 1, minWidth: 420, maxWidth: 700, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div className="validation-section" style={{ marginBottom: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ color: '#fff', textAlign: 'center', margin: 0, flex: 1 }}>Compétences requises</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isExtractingSkills && (
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 8, 
                        color: '#00ff99',
                        fontSize: '14px'
                      }}>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid #00ff99',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        Extraction...
                      </div>
                    )}
                    {jobSkills && (
                      editingSkills ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button 
                            onClick={() => {
                              setEditingSkills(false);
                            }}
                            style={{
                              background: '#00ff99',
                              color: '#111',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              fontWeight: '600'
                            }}
                          >
                            Sauvegarder
                          </button>
                          <button 
                            onClick={() => {
                              setEditingSkills(false);
                              setEditedJobSkills(jobSkills);
                            }}
                            style={{
                              background: '#ff6b6b',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              fontWeight: '600'
                            }}
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setEditingSkills(true);
                            setEditedJobSkills(jobSkills);
                          }}
                          style={{
                            background: 'transparent',
                            color: '#00ff99',
                            border: '1px solid #00ff99',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          Modifier
                        </button>
                      )
                    )}
                  </div>
                </div>
                <div className="section-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {jobSkills ? (
                    <>
                      <div className="field-group">
                        <label>Compétences techniques :</label>
                        {editingSkills ? (
                          <textarea
                            value={(editedJobSkills?.technical_skills || []).join(', ') || ''}
                            onChange={(e) => handleSkillsChange('technical_skills', e.target.value.split(', ').filter(s => s.trim()))}
                            rows="3"
                            placeholder="Séparer par des virgules"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #444',
                              borderRadius: '4px',
                              background: '#1a1a1a',
                              color: '#fff',
                              fontSize: '14px',
                              resize: 'vertical'
                            }}
                          />
                        ) : (
                          <span>{(jobSkills.technical_skills || []).join(', ') || 'Non spécifié'}</span>
                        )}
                      </div>
                      <div className="field-group">
                        <label>Compétences générales :</label>
                        {editingSkills ? (
                          <textarea
                            value={(editedJobSkills?.soft_skills || []).join(', ') || ''}
                            onChange={(e) => handleSkillsChange('soft_skills', e.target.value.split(', ').filter(s => s.trim()))}
                            rows="3"
                            placeholder="Séparer par des virgules"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #444',
                              borderRadius: '4px',
                              background: '#1a1a1a',
                              color: '#fff',
                              fontSize: '14px',
                              resize: 'vertical'
                            }}
                          />
                        ) : (
                          <span>{(jobSkills.soft_skills || []).join(', ') || 'Non spécifié'}</span>
                        )}
                      </div>
                      <div className="field-group">
                        <label>Langues :</label>
                        {editingSkills ? (
                          <textarea
                            value={(editedJobSkills?.languages || []).join(', ') || ''}
                            onChange={(e) => handleSkillsChange('languages', e.target.value.split(', ').filter(s => s.trim()))}
                            rows="2"
                            placeholder="Séparer par des virgules"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #444',
                              borderRadius: '4px',
                              background: '#1a1a1a',
                              color: '#fff',
                              fontSize: '14px',
                              resize: 'vertical'
                            }}
                          />
                        ) : (
                          <span>{(jobSkills.languages || []).join(', ') || 'Non spécifié'}</span>
                        )}
                      </div>
                      <div className="field-group">
                        <label>Outils/Plateformes :</label>
                        {editingSkills ? (
                          <textarea
                            value={(editedJobSkills?.tools_platforms || []).join(', ') || ''}
                            onChange={(e) => handleSkillsChange('tools_platforms', e.target.value.split(', ').filter(s => s.trim()))}
                            rows="2"
                            placeholder="Séparer par des virgules"
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #444',
                              borderRadius: '4px',
                              background: '#1a1a1a',
                              color: '#fff',
                              fontSize: '14px',
                              resize: 'vertical'
                            }}
                          />
                        ) : (
                          <span>{(jobSkills.tools_platforms || []).join(', ') || 'Non spécifié'}</span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      height: '100%',
                      color: '#888',
                      fontStyle: 'italic'
                    }}>
                      Aucune compétence extraite
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="validation-actions" style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32 }}>
          <button className="frontpage-navbar-btn" type="button" onClick={onBack}>⬅ Retour</button>
          <button className="frontpage-navbar-btn" type="button" onClick={() => onContinue(editedPairs)}>Valider et continuer</button>
        </div>
      </div>
    </div>
  );
} 