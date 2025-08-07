import React from 'react';
import './ResumeValidation.css';
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
      case 'parallel':
        return {
          title: 'Traitement intelligent accéléré',
          description: 'Notre IA traite simultanément la synthèse, l\'alignement des expériences et l\'extraction des compétences pour un résultat ultra-rapide.',
          icon: '🚀'
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
          minHeight: '60vh'
        }}>
          {/* Rocket emoji */}
          <div style={{
            fontSize: '120px',
            animation: 'rocketFloat 2s ease-in-out infinite'
          }}>
            🚀
          </div>
        </div>
      </div>
    </div>
  );
} 