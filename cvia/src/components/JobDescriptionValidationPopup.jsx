import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './JobDescriptionValidationPopup.css';

export default function JobDescriptionValidationPopup({ 
  isOpen, 
  onClose, 
  originalDescription,
  onValidate,
  onReject
}) {
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Générer la synthèse quand le popup s'ouvre
  useEffect(() => {
    if (isOpen && originalDescription && !summary) {
      generateSummary();
    }
  }, [isOpen, originalDescription]);

  // Gérer la fermeture avec Échap
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  const generateSummary = async () => {
    setIsGenerating(true);
    setError('');
    
    try {
      console.log('🔍 Generating job description summary...');
      
      const response = await fetch('http://localhost:8000/validate_job_description/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: originalDescription
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur lors de la validation (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Job description validation response:', data);
      
      setSummary(data.summary || data.validated_description || '');
      
    } catch (error) {
      console.error('❌ Error generating summary:', error);
      setError(`Erreur lors de la génération de la synthèse: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleValidate = () => {
    onValidate(summary);
  };

  const handleReject = () => {
    onReject();
  };

  const handleSummaryChange = (e) => {
    setSummary(e.target.value);
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="job-validation-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="job-validation-popup">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <h3>Synthèse du poste</h3>
        
        {isGenerating ? (
          <div className="loading-state">
            <div className="spinner">🤖</div>
            <p>Génération de la synthèse...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={generateSummary}>🔄 Réessayer</button>
          </div>
        ) : (
          <>
            <div className="summary-text">
              {summary}
            </div>
            <button 
              className="validate-btn" 
              onClick={handleValidate}
              disabled={!summary.trim()}
            >
              Valider
            </button>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}