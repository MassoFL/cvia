import React from 'react';
import './ResumeValidation.css';
import { ProgressSteps } from './FrontPage';

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

export default function ProcessingStep({ 
  currentPhase = 'summary', 
  jobDescription = "",
  onComplete 
}) {
  const getPhaseInfo = () => {
    switch (currentPhase) {
      case 'summary':
        return {
          title: 'Génération de la synthèse du poste',
          description: 'Notre IA analyse la description du poste et crée une synthèse optimisée.',
          icon: '📋'
        };
      case 'alignment':
        return {
          title: 'Alignement des expériences',
          description: 'Vos expériences sont adaptées pour correspondre parfaitement au poste.',
          icon: '🎯'
        };
      case 'skills':
        return {
          title: 'Extraction des compétences',
          description: 'Les compétences requises sont identifiées et organisées.',
          icon: '🛠️'
        };
      default:
        return {
          title: 'Traitement en cours',
          description: 'Veuillez patienter pendant que notre IA traite vos données.',
          icon: '⚙️'
        };
    }
  };

  const phaseInfo = getPhaseInfo();

  return (
    <div className="frontpage-bg">
      <Navbar />
      <div className="bottom-progress-steps">
        <ProgressSteps currentStepIndex={3} />
      </div>
      <div className="validation-content">
        <div className="validation-header">
          <h1>Traitement en cours</h1>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '32px'
        }}>
          {/* Main processing animation */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            padding: '48px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '16px',
            border: '2px solid #00ff99',
            backdropFilter: 'blur(8px)',
            maxWidth: '600px',
            width: '100%'
          }}>
            {/* Phase icon */}
            <div style={{
              fontSize: '64px',
              marginBottom: '16px'
            }}>
              {phaseInfo.icon}
            </div>

            {/* Phase title */}
            <h2 style={{
              color: '#00ff99',
              fontSize: '24px',
              fontWeight: '600',
              textAlign: 'center',
              margin: '0 0 16px 0'
            }}>
              {phaseInfo.title}
            </h2>

            {/* Phase description */}
            <p style={{
              color: '#ccc',
              fontSize: '16px',
              textAlign: 'center',
              lineHeight: '1.6',
              margin: '0 0 32px 0'
            }}>
              {phaseInfo.description}
            </p>

            {/* Loading animation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              color: '#00ff99'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid #00ff99',
                borderTop: '3px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <span style={{
                fontSize: '16px',
                fontWeight: '600'
              }}>
                Traitement en cours...
              </span>
            </div>
          </div>



          {/* Progress indicators */}
          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: currentPhase === 'summary' ? '#00ff99' : '#666'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: currentPhase === 'summary' ? '#00ff99' : '#333',
                border: currentPhase === 'summary' ? '2px solid #00ff99' : '2px solid #333'
              }} />
              <span style={{ fontSize: '14px' }}>Synthèse</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: currentPhase === 'alignment' ? '#00ff99' : '#666'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: currentPhase === 'alignment' ? '#00ff99' : '#333',
                border: currentPhase === 'alignment' ? '2px solid #00ff99' : '2px solid #333'
              }} />
              <span style={{ fontSize: '14px' }}>Alignement</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: currentPhase === 'skills' ? '#00ff99' : '#666'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: currentPhase === 'skills' ? '#00ff99' : '#333',
                border: currentPhase === 'skills' ? '2px solid #00ff99' : '2px solid #333'
              }} />
              <span style={{ fontSize: '14px' }}>Compétences</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 