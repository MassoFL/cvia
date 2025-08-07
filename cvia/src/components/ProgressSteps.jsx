import React from 'react';

export function ProgressSteps({ currentStepIndex = 0 }) {
  const steps = [
    'Chargement du CV',
    'Validation des données', 
    'Informations sur le poste',
    'Validation nouvelles données',
    'Téléchargement du nouveau CV'
  ];

  return (
    <div className="frontpage-steps">
      {steps.map((stepLabel, idx) => {
        const isCompleted = idx < currentStepIndex;
        const isCurrent = idx === currentStepIndex;
        
        return (
          <React.Fragment key={idx}>
            <div className={`frontpage-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
              <div className="frontpage-step-icon">
                {idx + 1}
              </div>
              <div className="frontpage-step-label">{stepLabel}</div>
            </div>
            {idx < steps.length - 1 && (
              <div className={`frontpage-step-line ${isCompleted ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}