import React, { useState } from 'react';
import './ResumeValidation.css';
import { FaCheck } from 'react-icons/fa';

// Reuse the ProgressSteps from FrontPage
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

export default function JobDescriptionStep({ onContinue, onBack, isGeneratingSummary = false }) {
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onContinue) onContinue(description);
  };

  return (
    <div className="frontpage-bg">
      <Navbar />
      <div className="bottom-progress-steps">
        <ProgressSteps currentStepIndex={2} />
      </div>
      <div className="validation-content">
        <div className="validation-header">
          <h1>Description du poste souhaité</h1>
        </div>
        <form className="job-description-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <textarea
            className="job-description-textarea"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Collez ici la description du poste qui vous intéresse..."
            rows={5}
            required
            style={{ width: 800, fontSize: 16, padding: 16, borderRadius: 8, border: '1px solid #ccc', marginBottom: 24 }}
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
    </div>
  );
} 