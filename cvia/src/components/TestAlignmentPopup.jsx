import React, { useState } from 'react';
import AlignmentConfigPanel from './AlignmentConfigPanel';

// Composant de test pour vérifier que le popup s'affiche correctement
export default function TestAlignmentPopup() {
  const [showPanel, setShowPanel] = useState(false);
  const [config, setConfig] = useState({
    level: 'balanced',
    focus: ['keywords', 'responsibilities'],
    writingStyle: 'professional',
    customInstructions: '',
    preserveCompanyNames: true,
    preserveDates: true,
    enhanceAchievements: true
  });

  const handleApply = (newConfig) => {
    console.log('Configuration appliquée:', newConfig);
    setConfig(newConfig);
    setShowPanel(false);
    alert('Configuration appliquée avec succès !');
  };

  return (
    <div style={{
      padding: '50px',
      background: '#1a1a1a',
      minHeight: '100vh',
      color: '#fff'
    }}>
      <h1>Test du Popup de Configuration d'Alignement</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Ce composant teste que le popup s'affiche bien au centre de l'écran.</p>
        <p>Configuration actuelle : {JSON.stringify(config, null, 2)}</p>
      </div>

      <button 
        onClick={() => setShowPanel(true)}
        style={{
          background: 'linear-gradient(135deg, #00ff99, #00cc7a)',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>⚙️</span>
        Ouvrir le Panel de Configuration
      </button>

      <div style={{ marginTop: '20px', color: '#999' }}>
        <h3>Instructions de test :</h3>
        <ol>
          <li>Cliquez sur le bouton ci-dessus</li>
          <li>Le popup doit s'ouvrir AU CENTRE de l'écran</li>
          <li>Il doit avoir un fond sombre avec blur</li>
          <li>Vous devez pouvoir configurer tous les paramètres</li>
          <li>Cliquez "Appliquer" pour tester la fermeture</li>
        </ol>
      </div>

      <AlignmentConfigPanel
        isOpen={showPanel}
        onClose={() => setShowPanel(false)}
        currentConfig={config}
        onConfigChange={setConfig}
        onApply={handleApply}
        isApplying={false}
      />
    </div>
  );
}