import React, { useState } from 'react';
import './ResumeValidation.css';
import { FaCheck } from 'react-icons/fa';
import JobDescriptionValidationPopup from './components/JobDescriptionValidationPopup';

// Reuse the ProgressSteps from components
import { ProgressSteps } from './components/ProgressSteps';

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

export default function JobDescriptionStep({ onContinue, onBack, isGeneratingSummary = false }) {
  const [description, setDescription] = useState('');
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [inputMode, setInputMode] = useState('text'); // 'text' ou 'url'
  const [url, setUrl] = useState('');
  const [isExtractingUrl, setIsExtractingUrl] = useState(false);
  const [extractionError, setExtractionError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Vérifier que la description n'est pas vide
    if (!description.trim()) {
      alert('Veuillez saisir une description du poste');
      return;
    }
    
    // Vérifier la longueur minimale
    if (description.trim().length < 20) {
      alert('La description du poste doit contenir au moins 20 caractères');
      return;
    }
    
    // Ouvrir le popup de validation
    setShowValidationPopup(true);
  };

  const handleValidationSuccess = (validatedSummary) => {
    setShowValidationPopup(false);
    // Passer la description originale (le système a besoin du texte complet pour l'analyse)
    // La synthèse validée sera utilisée pour l'affichage dans les étapes suivantes
    if (onContinue) onContinue(description);
  };

  const handleValidationReject = () => {
    setShowValidationPopup(false);
    // L'utilisateur peut modifier sa description
  };

  const handleValidationClose = () => {
    setShowValidationPopup(false);
  };

  const getHelpfulErrorMessage = (url, errorMessage) => {
    const domain = url.toLowerCase();
    
    if (domain.includes('indeed.com')) {
      return "Indeed bloque l'extraction automatique. Ouvrez l'offre d'emploi, sélectionnez tout le texte de la description (Ctrl+A), copiez-le (Ctrl+C) et collez-le dans la zone de texte.";
    } else if (domain.includes('linkedin.com')) {
      return "LinkedIn bloque l'extraction automatique. Connectez-vous à LinkedIn, ouvrez l'offre d'emploi, copiez la description du poste et collez-la dans la zone de texte.";
    } else if (domain.includes('pole-emploi.fr')) {
      return "Pôle Emploi bloque l'extraction automatique. Ouvrez l'offre sur le site, copiez la description complète et collez-la dans la zone de texte.";
    } else if (domain.includes('apec.fr')) {
      return "L'APEC bloque l'extraction automatique. Copiez manuellement la description de l'offre depuis le site et collez-la dans la zone de texte.";
    } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
      return "Ce site bloque l'extraction automatique pour des raisons de sécurité. Copiez manuellement le contenu de l'offre d'emploi.";
    } else if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
      return "La page n'existe pas ou n'est plus accessible. Vérifiez que l'URL est correcte.";
    } else if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
      return "Le site met trop de temps à répondre. Réessayez ou copiez manuellement le contenu.";
    }
    
    return errorMessage;
  };

  const handleExtractFromUrl = async () => {
    if (!url.trim()) {
      setExtractionError('Veuillez saisir une URL valide');
      return;
    }

    setIsExtractingUrl(true);
    setExtractionError('');

    try {
      console.log('🔍 Extracting content from URL:', url);
      
      const response = await fetch('http://localhost:8000/extract_url_content/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail || `Erreur ${response.status}`;
        throw new Error(getHelpfulErrorMessage(url, errorMessage));
      }
      
      const data = await response.json();
      console.log('✅ URL extraction response:', data);
      
      // Mettre à jour la description avec le contenu extrait
      setDescription(data.content || '');
      setExtractionError('');
      
      // Afficher un message de succès
      if (data.title) {
        console.log(`✅ Contenu extrait avec succès: "${data.title}"`);
        // Optionnel: afficher une notification de succès
      }
      
    } catch (error) {
      console.error('❌ Error extracting URL:', error);
      setExtractionError(error.message);
    } finally {
      setIsExtractingUrl(false);
    }
  };

  return (
    <div className="frontpage-bg">
      <Navbar />
      <div className="bottom-progress-steps">
        <ProgressSteps currentStepIndex={2} />
      </div>
      <div className="validation-content">
        <div className="validation-header">
          <h1>Description du poste</h1>
        </div>

        {/* Mode selector tabs */}
        <div className="input-mode-tabs" style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, gap: 0 }}>
          <button
            type="button"
            className={`mode-tab ${inputMode === 'text' ? 'active' : ''}`}
            onClick={() => setInputMode('text')}
            style={{
              padding: '12px 24px',
              background: inputMode === 'text' ? 'linear-gradient(135deg, #00ff99, #00bfff)' : 'rgba(255, 255, 255, 0.1)',
              color: inputMode === 'text' ? '#000' : '#fff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px 0 0 8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            📝 Saisie manuelle
          </button>
          <button
            type="button"
            className={`mode-tab ${inputMode === 'url' ? 'active' : ''}`}
            onClick={() => setInputMode('url')}
            style={{
              padding: '12px 24px',
              background: inputMode === 'url' ? 'linear-gradient(135deg, #00ff99, #00bfff)' : 'rgba(255, 255, 255, 0.1)',
              color: inputMode === 'url' ? '#000' : '#fff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '0 8px 8px 0',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            🔗 Extraction depuis URL
          </button>
        </div>

        {/* URL input mode */}
        {inputMode === 'url' && (
          <div className="url-input-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, width: '100%', maxWidth: 800 }}>
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com/job-offer"
                style={{
                  flex: 1,
                  fontSize: 16,
                  padding: 16,
                  borderRadius: 0,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  backdropFilter: 'blur(10px)'
                }}
                disabled={isExtractingUrl}
              />
              <button
                type="button"
                onClick={handleExtractFromUrl}
                disabled={isExtractingUrl || !url.trim()}
                style={{
                  padding: '16px 24px',
                  background: isExtractingUrl ? 'rgba(255, 255, 255, 0.2)' : 'linear-gradient(135deg, #00ff99, #00bfff)',
                  color: isExtractingUrl ? '#fff' : '#000',
                  border: 'none',
                  borderRadius: 0,
                  cursor: isExtractingUrl ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {isExtractingUrl ? '🔄 Extraction...' : '🚀 Extraire'}
              </button>
            </div>
            
            {extractionError && (
              <div style={{
                background: 'rgba(255, 107, 107, 0.1)',
                border: '1px solid rgba(255, 107, 107, 0.3)',
                borderRadius: 0,
                padding: '16px',
                color: '#ff6b6b',
                fontSize: '14px',
                width: '100%',
                maxWidth: 800,
                marginBottom: 16,
                lineHeight: '1.5'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                  ⚠️ Extraction impossible
                </div>
                <div style={{ marginBottom: '12px' }}>
                  {extractionError}
                </div>
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  padding: '12px', 
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div>
                    💡 <strong>Solution :</strong> Copiez manuellement le contenu de l'offre d'emploi depuis le site web et collez-le dans la zone de texte.
                  </div>
                  <button
                    type="button"
                    onClick={() => setInputMode('text')}
                    style={{
                      padding: '6px 12px',
                      background: 'linear-gradient(135deg, #00ff99, #00bfff)',
                      color: '#000',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    📝 Saisie manuelle
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <form className="job-description-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <textarea
            className="job-description-textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={inputMode === 'text' ? "Collez ici la description du poste qui vous intéresse..." : "Le contenu extrait de l'URL apparaîtra ici..."}
            rows={inputMode === 'url' ? 8 : 5}
            required
            style={{ 
              width: 800, 
              fontSize: 16, 
              padding: 16, 
              borderRadius: 0, 
              border: '1px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              backdropFilter: 'blur(10px)',
              marginBottom: 24
            }}
            readOnly={inputMode === 'url' && isExtractingUrl}
          />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16, gap: 16 }}>
            <button type="button" className="frontpage-navbar-btn" onClick={onBack}>
              ⬅ Retour
            </button>
            <button type="submit" className="frontpage-navbar-btn">
              <FaCheck style={{ marginRight: 8 }} /> Continuer
            </button>
          </div>
        </form>
      </div>

      {/* Popup de validation de la description */}
      <JobDescriptionValidationPopup
        isOpen={showValidationPopup}
        onClose={handleValidationClose}
        originalDescription={description}
        onValidate={handleValidationSuccess}
        onReject={handleValidationReject}
      />
    </div>
  );
} 