import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './AlignmentConfigPanel.css';

const ALIGNMENT_LEVELS = [
  { 
    value: 'conservative', 
    label: 'Conservateur', 
    description: 'Modifications minimales, préserve l\'authenticité',
    icon: '🛡️'
  },
  { 
    value: 'balanced', 
    label: 'Équilibré', 
    description: 'Optimise sans dénaturer l\'expérience',
    icon: '⚖️'
  },
  { 
    value: 'aggressive', 
    label: 'Agressif', 
    description: 'Maximise l\'adéquation avec le poste',
    icon: '🎯'
  },
  { 
    value: 'creative', 
    label: 'Créatif', 
    description: 'Reformulation créative et impactante',
    icon: '✨'
  }
];

const ALIGNMENT_FOCUS = [
  { value: 'keywords', label: 'Mots-clés techniques', description: 'Optimise pour les ATS et mots-clés' },
  { value: 'responsibilities', label: 'Responsabilités', description: 'Met l\'accent sur les tâches similaires' },
  { value: 'achievements', label: 'Réalisations', description: 'Valorise les résultats et impacts' },
  { value: 'skills', label: 'Compétences', description: 'Aligne sur les compétences requises' },
  { value: 'leadership', label: 'Leadership', description: 'Met en avant le management et l\'initiative' }
];

const WRITING_STYLES = [
  { value: 'professional', label: 'Professionnel', description: 'Ton formel et corporate' },
  { value: 'dynamic', label: 'Dynamique', description: 'Langage énergique et proactif' },
  { value: 'technical', label: 'Technique', description: 'Vocabulaire spécialisé et précis' },
  { value: 'results-oriented', label: 'Orienté résultats', description: 'Focus sur les métriques et KPIs' }
];

const CUSTOM_INSTRUCTIONS_EXAMPLES = [
  "Mettre l'accent sur les technologies mentionnées dans l'offre",
  "Éviter de mentionner les technologies obsolètes",
  "Utiliser le vocabulaire spécifique au secteur",
  "Quantifier les résultats avec des chiffres",
  "Souligner l'expérience en équipe agile"
];

export default function AlignmentConfigPanel({ 
  isOpen, 
  onClose, 
  currentConfig, 
  onConfigChange,
  onApply,
  isApplying = false 
}) {
  const [config, setConfig] = useState({
    level: 'balanced',
    focus: ['keywords', 'responsibilities'],
    writingStyle: 'professional',
    customInstructions: '',
    preserveCompanyNames: true,
    preserveDates: true,
    enhanceAchievements: true,
    ...currentConfig
  });

  const [showPreview, setShowPreview] = useState(false);

  // Effet pour gérer l'ouverture/fermeture du modal
  useEffect(() => {
    if (isOpen) {
      // Empêcher le scroll de la page quand le modal est ouvert
      document.body.style.overflow = 'hidden';
      
      // Gérer la fermeture avec la touche Échap
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

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const handleFocusChange = (focusValue) => {
    const currentFocus = config.focus || [];
    const newFocus = currentFocus.includes(focusValue)
      ? currentFocus.filter(f => f !== focusValue)
      : [...currentFocus, focusValue];
    
    handleConfigChange('focus', newFocus);
  };

  const handleApply = () => {
    onApply?.(config);
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="alignment-config-overlay"
      onClick={(e) => {
        // Fermer le modal si on clique sur l'overlay (pas sur le panel)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="alignment-config-panel">
        {/* Header */}
        <div className="config-header">
          <h3>⚙️ Configuration de l'alignement</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="config-content">
          {/* Niveau d'alignement */}
          <div className="config-section">
            <h4>🎚️ Niveau d'alignement</h4>
            <div className="alignment-levels">
              {ALIGNMENT_LEVELS.map(level => (
                <div 
                  key={level.value}
                  className={`level-option ${config.level === level.value ? 'selected' : ''}`}
                  onClick={() => handleConfigChange('level', level.value)}
                >
                  <div className="level-icon">{level.icon}</div>
                  <div className="level-info">
                    <div className="level-label">{level.label}</div>
                    <div className="level-description">{level.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Focus d'alignement */}
          <div className="config-section">
            <h4>🎯 Focus d'alignement (sélection multiple)</h4>
            <div className="focus-options">
              {ALIGNMENT_FOCUS.map(focus => (
                <div 
                  key={focus.value}
                  className={`focus-option ${config.focus?.includes(focus.value) ? 'selected' : ''}`}
                  onClick={() => handleFocusChange(focus.value)}
                >
                  <div className="focus-checkbox">
                    {config.focus?.includes(focus.value) ? '✓' : ''}
                  </div>
                  <div className="focus-info">
                    <div className="focus-label">{focus.label}</div>
                    <div className="focus-description">{focus.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Style de rédaction */}
          <div className="config-section">
            <h4>✍️ Style de rédaction</h4>
            <div className="writing-styles">
              {WRITING_STYLES.map(style => (
                <div 
                  key={style.value}
                  className={`style-option ${config.writingStyle === style.value ? 'selected' : ''}`}
                  onClick={() => handleConfigChange('writingStyle', style.value)}
                >
                  <div className="style-info">
                    <div className="style-label">{style.label}</div>
                    <div className="style-description">{style.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Options avancées */}
          <div className="config-section">
            <h4>🔧 Options avancées</h4>
            <div className="advanced-options">
              <label className="option-checkbox">
                <input 
                  type="checkbox" 
                  checked={config.preserveCompanyNames}
                  onChange={(e) => handleConfigChange('preserveCompanyNames', e.target.checked)}
                />
                <span>Préserver les noms d'entreprises</span>
              </label>
              
              <label className="option-checkbox">
                <input 
                  type="checkbox" 
                  checked={config.preserveDates}
                  onChange={(e) => handleConfigChange('preserveDates', e.target.checked)}
                />
                <span>Préserver les dates exactes</span>
              </label>
              
              <label className="option-checkbox">
                <input 
                  type="checkbox" 
                  checked={config.enhanceAchievements}
                  onChange={(e) => handleConfigChange('enhanceAchievements', e.target.checked)}
                />
                <span>Valoriser les réalisations</span>
              </label>
            </div>
          </div>

          {/* Instructions personnalisées */}
          <div className="config-section">
            <h4>📝 Instructions personnalisées</h4>
            <textarea
              className="custom-instructions"
              placeholder="Ajoutez des instructions spécifiques pour l'IA..."
              value={config.customInstructions}
              onChange={(e) => handleConfigChange('customInstructions', e.target.value)}
              rows={3}
            />
            
            <div className="instruction-examples">
              <div className="examples-label">💡 Exemples d'instructions :</div>
              {CUSTOM_INSTRUCTIONS_EXAMPLES.map((example, index) => (
                <div 
                  key={index}
                  className="example-instruction"
                  onClick={() => handleConfigChange('customInstructions', example)}
                >
                  "{example}"
                </div>
              ))}
            </div>
          </div>

          {/* Aperçu */}
          <div className="config-section">
            <button 
              className="preview-btn"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? '🙈 Masquer l\'aperçu' : '👁️ Aperçu de l\'alignement'}
            </button>
            
            {showPreview && (
              <div className="alignment-preview">
                <div className="preview-note">
                  💡 Aperçu basé sur votre première expérience avec les paramètres actuels
                </div>
                {/* Ici on pourrait ajouter un vrai aperçu */}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="config-footer">
          <button className="cancel-btn" onClick={onClose}>
            Annuler
          </button>
          <button 
            className="apply-btn" 
            onClick={handleApply}
            disabled={isApplying}
          >
            {isApplying ? '⏳ Application...' : '✨ Appliquer l\'alignement'}
          </button>
        </div>
      </div>
    </div>
  );

  // Utiliser createPortal pour rendre le modal directement dans le body
  return createPortal(modalContent, document.body);
}