import React, { useState } from 'react';
import { createPortal } from 'react-dom';

// Composant de diagnostic pour tester le positionnement du popup
export default function PopupDiagnostic() {
  const [showPopup, setShowPopup] = useState(false);

  const popupContent = (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(255, 0, 0, 0.8)', // Rouge pour bien voir
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 999999,
      margin: 0,
      padding: 0
    }}>
      <div style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#000', marginBottom: '20px' }}>
          🎯 Test de Positionnement
        </h2>
        <p style={{ color: '#333', marginBottom: '20px' }}>
          Si vous voyez ce popup AU CENTRE de l'écran avec un fond rouge, 
          alors le portal React fonctionne correctement !
        </p>
        <button 
          onClick={() => setShowPopup(false)}
          style={{
            background: '#00ff99',
            color: '#000',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          ✅ Fermer le test
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <h3>🔧 Diagnostic du Popup</h3>
      <p>Cliquez sur le bouton pour tester le positionnement du popup :</p>
      
      <button 
        onClick={() => setShowPopup(true)}
        style={{
          background: '#007bff',
          color: '#fff',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '6px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        🧪 Tester le Popup
      </button>

      {showPopup && createPortal(popupContent, document.body)}
    </div>
  );
}