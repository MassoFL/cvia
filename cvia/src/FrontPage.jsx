import React, { useRef, useState } from 'react';
import './FrontPage.css';
import { FaUpload, FaCheckCircle, FaUserTie, FaEdit, FaExclamationTriangle, FaDownload, FaCog, FaRocket, FaShieldAlt, FaClock, FaUsers } from 'react-icons/fa';
import ResumeValidation from './ResumeValidation';
import JobDescriptionStep from './JobDescriptionStep';
import ExperienceComparisonStep from './ExperienceComparisonStep';
import TemplateSelectionStep from './TemplateSelectionStep';
import ProcessingStep from './ProcessingStep';
import AuthModal from './components/AuthModal';
import UserDropdown from './components/UserDropdown';
import { useAuth } from './contexts/AuthContext';
import { ProgressSteps } from './components/ProgressSteps';

const ALIGNMENT_LEVELS = [
  { value: 'none', label: 'Aucune modification' },
  { value: 'light', label: 'Ajustement léger' },
  { value: 'strong', label: 'Ajustement fort' },
  { value: 'radical', label: 'Changement radical' },
];

function Navbar({ onAuthClick, user, isAuthenticated }) {
  return (
    <nav className="frontpage-navbar">
      <div className="frontpage-navbar-left">CVIA</div>
      <div className="frontpage-navbar-right">
        {isAuthenticated ? (
          <UserDropdown />
        ) : (
          <button className="frontpage-navbar-btn" onClick={onAuthClick}>
            Sign In / Sign Up
          </button>
        )}
      </div>
    </nav>
  );
}

function InfoSection() {
  return (
    <div className="frontpage-info-section">
      <div className="frontpage-info-content">
        <div>
          <h2 className="frontpage-info-title">Transformez <span className="gradient-text">votre CV</span> en quelques clics</h2>
          <p className="frontpage-info-subtitle">
            CVIA utilise l'intelligence artificielle pour adapter automatiquement votre CV à chaque offre d'emploi, 
            maximisant vos chances d'être sélectionné pour un entretien.
          </p>
        </div>
        
        <div className="frontpage-features">
          <div className="frontpage-feature">
            <div className="frontpage-feature-icon">
              <FaRocket />
            </div>
            <h3 className="frontpage-feature-title">Rapide et efficace</h3>
            <p className="frontpage-feature-description">
              Obtenez un CV optimisé en moins de 5 minutes. Notre IA analyse votre profil et l'offre d'emploi 
              pour créer une version parfaitement adaptée.
            </p>
          </div>
          
          <div className="frontpage-feature">
            <div className="frontpage-feature-icon">
              <FaShieldAlt />
            </div>
            <h3 className="frontpage-feature-title">Sécurisé et privé</h3>
            <p className="frontpage-feature-description">
              Vos données restent confidentielles. Nous utilisons des technologies de pointe pour protéger 
              vos informations personnelles et professionnelles.
            </p>
          </div>
          
          <div className="frontpage-feature">
            <div className="frontpage-feature-icon">
              <FaClock />
            </div>
            <h3 className="frontpage-feature-title">Gagnez du temps</h3>
            <p className="frontpage-feature-description">
              Plus besoin de réécrire votre CV pour chaque candidature. Concentrez-vous sur votre recherche 
              d'emploi pendant que nous optimisons votre profil.
            </p>
          </div>
          
          <div className="frontpage-feature">
            <div className="frontpage-feature-icon">
              <FaUsers />
            </div>
            <h3 className="frontpage-feature-title">Recommandé par les recruteurs</h3>
            <p className="frontpage-feature-description">
              Nos CV optimisés respectent les standards de l'industrie et sont conçus pour passer les 
              systèmes de filtrage automatique des entreprises.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ATSOptimizationSection() {
  const [selectedContent, setSelectedContent] = useState('analysis');

  const contentItems = [
    {
      id: 'analysis',
      title: 'Analyse intelligente des offres',
      description: 'Notre IA analyse l\'offre d\'emploi pour identifier les mots-clés essentiels et les compétences recherchées, garantissant que votre CV correspond parfaitement aux attentes du recruteur.',
      visual: 'analysis'
    },
    {
      id: 'optimization',
      title: 'Validation par les ATS',
      description: 'Les ATS (Applicant Tracking Systems) sont des logiciels utilisés par 90% des entreprises pour filtrer automatiquement les CV. Votre CV est reformulé pour passer ces filtres et maximiser vos chances d\'être sélectionné.',
      visual: 'optimization'
    },
    {
      id: 'presentation',
      title: 'Présentation humaine',
      description: 'Le CV reste naturel et lisible pour les recruteurs tout en étant optimisé pour les machines, offrant le meilleur des deux mondes pour votre candidature.',
      visual: 'presentation'
    }
  ];

  const renderVisual = (visualType) => {
    switch (visualType) {
      case 'analysis':
        return (
          <div className="frontpage-ats-circuit-board analysis-board">
            <div className="frontpage-ats-analysis-visual">
              <div className="frontpage-ats-keywords">
                <div className="keyword-item">Python</div>
                <div className="keyword-item">React</div>
                <div className="keyword-item">Machine Learning</div>
                <div className="keyword-item">Agile</div>
                <div className="keyword-item">DevOps</div>
                <div className="keyword-item">JavaScript</div>
                <div className="keyword-item">SQL</div>
                <div className="keyword-item">Docker</div>
                <div className="keyword-item">AWS</div>
                <div className="keyword-item">Node.js</div>
                <div className="keyword-item">TypeScript</div>
                <div className="keyword-item">Kubernetes</div>
                <div className="keyword-item">Git</div>
                <div className="keyword-item">MongoDB</div>
                <div className="keyword-item">GraphQL</div>
                <div className="keyword-item">Marketing</div>
                <div className="keyword-item">Ventes</div>
                <div className="keyword-item">Finance</div>
                <div className="keyword-item">Gestion</div>
                <div className="keyword-item">Communication</div>
                <div className="keyword-item">Leadership</div>
                <div className="keyword-item">Analyse</div>
                <div className="keyword-item">Stratégie</div>
                <div className="keyword-item">Innovation</div>
                <div className="keyword-item">Qualité</div>
                <div className="keyword-item">Sécurité</div>
                <div className="keyword-item">Formation</div>
                <div className="keyword-item">Recrutement</div>
                <div className="keyword-item">Logistique</div>
                <div className="keyword-item">Design</div>
                <div className="keyword-item">Santé</div>
                <div className="keyword-item">Éducation</div>
                <div className="keyword-item">Consulting</div>
              </div>
              <div className="frontpage-ats-connection-lines"></div>
            </div>
          </div>
        );
      case 'optimization':
        return (
          <div className="frontpage-ats-circuit-board optimization-board">
            <div className="frontpage-ats-optimization-visual">
              <div className="frontpage-ats-score-meter">
                <div className="score-bar">
                  <div className="score-fill" style={{width: '95%'}}></div>
                </div>
                <div className="score-text">95% taux de réussite</div>
              </div>
            </div>
          </div>
        );
      case 'presentation':
        return (
          <div className="frontpage-ats-circuit-board presentation-board">
            <div className="frontpage-ats-presentation-visual">
              <div className="frontpage-ats-document">
                <div className="document-line"></div>
                <div className="document-line"></div>
                <div className="document-line"></div>
                <div className="document-line short"></div>
                <div className="document-line"></div>
                <div className="document-line"></div>
                <div className="document-line short"></div>
                <div className="document-line"></div>
                <div className="document-line"></div>
                <div className="document-line short"></div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="frontpage-ats-section">
      <div className="frontpage-ats-content">
        {/* Header Section */}
        <div className="frontpage-ats-header">
          <h2 className="frontpage-ats-title">Pourquoi optimiser votre CV avec l'IA ?</h2>
          <p className="frontpage-ats-subtitle">
            <strong>75% des CV sont rejetés avant même d'être vus par un recruteur</strong> à cause des systèmes 
            de filtrage automatisé (ATS - Applicant Tracking Systems).
          </p>
          <button className="frontpage-ats-demo-btn">
            Commencer maintenant
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        {/* Main Content - Two Column Layout */}
        <div className="frontpage-ats-main">
          {/* Left Column - Content */}
          <div className="frontpage-ats-left">
            {contentItems.map((item) => (
              <div 
                key={item.id}
                className={`frontpage-ats-content-block ${selectedContent === item.id ? 'active' : ''}`}
                onClick={() => setSelectedContent(item.id)}
              >
                <h3 className={`frontpage-ats-content-title ${selectedContent === item.id ? '' : 'secondary'}`}>
                  {item.title}
                </h3>
                <p className={`frontpage-ats-content-description ${selectedContent === item.id ? '' : 'secondary'}`}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* Right Column - Illustration */}
          <div className="frontpage-ats-right">
            <div className="frontpage-ats-illustration">
              {renderVisual(contentItems.find(item => item.id === selectedContent)?.visual)}
            </div>
          </div>
        </div>
        
        {/* Bottom Icon */}
        <div className="frontpage-ats-bottom-icon">
          <div className="frontpage-ats-icon-circle">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FrontPage() {
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', or null
  const [statusMessage, setStatusMessage] = useState('');
  const [currentStep, setCurrentStep] = useState('upload'); // 'upload' or 'validation'
  const [ocrResultId, setOcrResultId] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [validatedData, setValidatedData] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [jobSummary, setJobSummary] = useState('');
  const [oldExperiences, setOldExperiences] = useState([]);
  const [resumeSkills, setResumeSkills] = useState({});
  const [jobSkills, setJobSkills] = useState({});
  const [alignmentPairs, setAlignmentPairs] = useState([]); // [{old, new, score}]
  const [alignmentLevel, setAlignmentLevel] = useState('light');
  const [pendingAlignmentLevel, setPendingAlignmentLevel] = useState('light');
  const [isAligningExperiences, setIsAligningExperiences] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [processingPhase, setProcessingPhase] = useState('summary');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generatedPDFData, setGeneratedPDFData] = useState(null);
  
  // Authentication state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const { user, isAuthenticated } = useAuth();

  const GREEN = '#00ff99';

  // Authentication handlers
  const handleAuthClick = () => {
    setAuthModalMode('login');
    setShowAuthModal(true);
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const validateFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const allowedExtensions = ['.pdf', '.docx'];
    
    // Check file extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    
    // Check MIME type
    const hasValidMimeType = allowedTypes.includes(file.type);
    
    if (!hasValidExtension && !hasValidMimeType) {
      return {
        isValid: false,
        message: 'Format de fichier non supporté. Veuillez utiliser un fichier PDF (.pdf) ou Word (.docx).'
      };
    }
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return {
        isValid: false,
        message: 'Le fichier est trop volumineux. La taille maximale est de 10MB.'
      };
    }
    
    return { isValid: true };
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Reset status
      setUploadStatus(null);
      setStatusMessage('');
      
      // Validate file
      const validation = validateFile(file);
      if (!validation.isValid) {
        setUploadStatus('error');
        setStatusMessage(validation.message);
        return;
      }
      
      // Show loading state
      setUploadStatus('loading');
      setStatusMessage('Téléchargement et extraction en cours...');
      
      const formData = new FormData();
      formData.append('file', file);
  
      fetch('http://localhost:8000/api/v1/extract_structured_data_working', {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('📤 Upload response:', data);
          
          // Validate response structure
          if (!data || typeof data !== 'object') {
            throw new Error('Invalid response format from server');
          }
          
          if (data.error) {
            throw new Error(data.error);
          }
          
          if (!data.structured_data) {
            throw new Error('No structured data received from server');
          }
          
          console.log(`✅ Structured data extraction successful, raw text: ${data.raw_text_length} characters`);
          setUploadStatus('success');
          setStatusMessage('CV téléchargé et structuré avec succès !');
          
          // Store the structured data and pass directly to validation step
          setFileId('extracted_cv'); // Use a simple identifier
          setOcrResultId('extracted_cv'); // Use same identifier for compatibility
          setCurrentStep('validation');
          
          // Store the structured data for the validation step
          localStorage.setItem('structured_data', JSON.stringify(data.structured_data));
          localStorage.setItem('raw_text_length', data.raw_text_length.toString());
        })
        .catch(error => {
          console.error('❌ Upload error:', error);
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
          });
          
          // Provide more specific error messages
          let errorMessage = 'Erreur lors du téléchargement. Veuillez réessayer.';
          
          if (error.message.includes('Failed to fetch')) {
            errorMessage = 'Erreur de connexion au serveur. Vérifiez votre connexion internet.';
          } else if (error.message.includes('413')) {
            errorMessage = 'Le fichier est trop volumineux. Taille maximale : 10MB.';
          } else if (error.message.includes('400')) {
            errorMessage = 'Format de fichier non supporté. Utilisez PDF ou DOCX.';
          } else if (error.message.includes('500')) {
            errorMessage = 'Erreur serveur. Veuillez réessayer dans quelques instants.';
          } else if (error.message.includes('Invalid response format')) {
            errorMessage = 'Erreur de communication avec le serveur. Veuillez réessayer.';
          } else if (error.message.includes('No file_id received')) {
            errorMessage = 'Erreur lors du traitement du fichier. Veuillez réessayer.';
          }
          
          setUploadStatus('error');
          setStatusMessage(errorMessage);
        });
    }
    
    // Reset file input
    e.target.value = '';
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'success':
        return <FaCheckCircle className="status-icon success" />;
      case 'error':
        return <FaExclamationTriangle className="status-icon error" />;
      case 'loading':
        return <div className="loading-spinner" />;
      default:
        return null;
    }
  };



  const handleValidationComplete = (data) => {
    console.log('🔍 Debug - handleValidationComplete received data:', data);
    
    setValidatedData(data);
    
    // Extract experiences from ChatGPT format
    let experiences = [];
    if (data?.experiences) {
      experiences = data.experiences;
    } else if (data?.experience) {
      experiences = data.experience;
    } else if (Array.isArray(data)) {
      experiences = data;
    }
    
    // Extract skills from ChatGPT format
    let skillsData = {};
    if (data?.skills) {
      skillsData = data.skills;
    } else if (typeof data === 'object' && data !== null) {
      // Look for skills in nested structure
      for (const key in data) {
        if (key.toLowerCase().includes('skill')) {
          skillsData = data[key];
          break;
        }
      }
    }
    
    console.log('🔍 Debug - Extracted experiences:', experiences);
    console.log('🔍 Debug - Extracted skills:', skillsData);
    
    setOldExperiences(experiences);
    setResumeSkills(skillsData); // Store original CV skills
    setCurrentStep('job');
  };

  const handleJobContinue = async (desc) => {
    setJobDescription(desc);
    setProcessingPhase('parallel');
    setCurrentStep('processing');
    
    // Debug: Log the data being sent
    console.log('🔍 Debug - Starting parallel processing for job description');
    console.log('Job description:', desc);
    
    // Validate required data
    if (!desc || desc.trim() === '') {
      throw new Error('La description du poste ne peut pas être vide');
    }
    
    if (!oldExperiences || oldExperiences.length === 0) {
      throw new Error('Aucune expérience trouvée. Veuillez d\'abord valider vos données dans l\'étape précédente.');
    }
    
    try {
      console.log('🚀 Starting parallel API calls...');
      
      // 🚀 APPELS PARALLÈLES - Tous les appels se font en même temps
      const [summaryResponse, alignResponse, skillsResponse] = await Promise.all([
        // 1. Génération de synthèse
        fetch('http://localhost:8000/generate_job_summary/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            job_description: desc,
            experiences: oldExperiences
          })
        }),
        
        // 2. Alignement des expériences
        fetch('http://localhost:8000/align_experiences/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            job_description: desc,
            experiences: oldExperiences,
            skills: resumeSkills,
            level: alignmentLevel
          })
        }),
        
        // 3. Extraction des compétences
        fetch('http://localhost:8000/extract_skills/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            job_description: desc
          })
        })
      ]);
      
      console.log('✅ All parallel API calls completed!');
      
      // Vérifier les réponses et traiter les erreurs
      if (!summaryResponse.ok) {
        const errorText = await summaryResponse.text();
        console.error('❌ Summary generation error:', summaryResponse.status, errorText);
        throw new Error(`Erreur lors de la génération de la synthèse (${summaryResponse.status}): ${errorText}`);
      }
      
      if (!alignResponse.ok) {
        const errorText = await alignResponse.text();
        console.error('❌ Alignment error:', alignResponse.status, errorText);
        throw new Error(`Erreur lors de l'alignement des expériences (${alignResponse.status}): ${errorText}`);
      }
      
      if (!skillsResponse.ok) {
        const errorText = await skillsResponse.text();
        console.error('❌ Skills extraction error:', skillsResponse.status, errorText);
        throw new Error(`Erreur lors de l'extraction des compétences (${skillsResponse.status}): ${errorText}`);
      }
      
      // Parser toutes les réponses en parallèle
      const [summaryData, alignData, skillsData] = await Promise.all([
        summaryResponse.json(),
        alignResponse.json(),
        skillsResponse.json()
      ]);
      
      console.log('✅ Job summary generated:', summaryData);
      console.log('✅ Experiences aligned:', alignData);
      console.log('✅ Skills extracted:', skillsData);
      
      // Mettre à jour les états avec toutes les données
      setJobSummary(summaryData.summary);
      setJobSkills(skillsData.extracted_skills);
      
      // Construire les paires d'alignement
      const pairs = oldExperiences.map((oldExp, index) => {
        const alignment = alignData.alignments[index] || {};
        return {
          old: oldExp,
          new: alignment.new || oldExp,
          score: alignment.score || 0,
          comment: alignment.comment || ''
        };
      });
      setAlignmentPairs(pairs);
      
      // Passer à l'étape suivante
      console.log('🎉 Parallel processing completed successfully!');
      setCurrentStep('compare-experiences');
      
    } catch (e) {
      console.error('❌ Error in parallel processing:', e);
      alert(`Erreur lors du traitement: ${e.message}`);
      setCurrentStep('job'); // Go back to job description step on error
    }
  };

  const handleBackToJob = () => {
    setCurrentStep('job');
  };

  const handleTemplateSelect = async (template) => {
    setSelectedTemplate(template);
    console.log('Template sélectionné:', template);
    
    try {
      // Préparer les données pour la génération PDF
      const pdfPayload = {
        template_id: template.id,
        user_data: validatedData || {}, // Données utilisateur extraites du CV
        job_description: jobDescription,
        job_summary: jobSummary,
        aligned_experiences: alignmentPairs.map(pair => ({
          old: pair.old,
          new: pair.new,
          score: pair.score,
          comment: pair.comment
        })),
        skills: jobSkills,
        original_experiences: oldExperiences
      };
      
      console.log('📋 Sending PDF generation request:', pdfPayload);
      
      const response = await fetch('http://localhost:8000/generate_pdf/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pdfPayload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ PDF generation error:', response.status, errorText);
        throw new Error(`Erreur lors de la génération du PDF (${response.status}): ${errorText}`);
      }
      
      const pdfData = await response.json();
      console.log('✅ PDF generated successfully:', pdfData);
      
      // Stocker les informations du PDF généré
      setGeneratedPDFData(pdfData);
      setCurrentStep('download');
      
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      alert(`Erreur lors de la génération du PDF: ${error.message}`);
    }
  };

  const handleBackToExperiences = () => {
    setCurrentStep('compare-experiences');
  };

  const handleExperiencesContinue = (editedPairs) => {
    setAlignmentPairs(editedPairs);
    setCurrentStep('template-selection');
  };

  const handleApplyAlignmentLevel = async () => {
    setIsAligningExperiences(true);
    setAlignmentLevel(pendingAlignmentLevel);
    // Also sync pendingAlignmentLevel to the applied value
    setPendingAlignmentLevel(pendingAlignmentLevel);
    // Re-call the agent with the new level
    try {
      const response = await fetch('http://localhost:8000/align_experiences/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: jobDescription,
          experiences: oldExperiences,
          skills: jobSkills,
          level: pendingAlignmentLevel
        })
      });
      if (!response.ok) throw new Error('Erreur lors de l\'alignement des expériences');
      const data = await response.json();
      // Construct alignment pairs by combining old experiences with new aligned data
      const pairs = oldExperiences.map((oldExp, index) => {
        const alignment = data.alignments[index] || {};
        return {
          old: oldExp,
          new: alignment.new || oldExp,
          score: alignment.score || 0,
          comment: alignment.comment || ''
        };
      });
      setAlignmentPairs(pairs);
    } catch (e) {
      alert(e.message || 'Erreur lors de l\'alignement des expériences');
    } finally {
      setIsAligningExperiences(false);
    }
  };

  // Show validation step if we're in validation step
  if (currentStep === 'validation') {
    return (
      <div className="frontpage-bg">
        <div className="frontpage-bg-glow1" />
        <div className="frontpage-bg-glow2" />
        <div className="frontpage-bg-glow3" />
        <Navbar onAuthClick={handleAuthClick} user={user} isAuthenticated={isAuthenticated()} />
        <div className="frontpage-content">

          <ResumeValidation 
            ocrResultId={ocrResultId} 
            onValidationComplete={handleValidationComplete}
          />
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={handleAuthModalClose} 
          initialMode={authModalMode} 
        />
      </div>
    );
  }

  // Show processing step if we're in processing step
  if (currentStep === 'processing') {
    return (
      <>
        <ProcessingStep currentPhase={processingPhase} jobDescription={jobDescription} />
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={handleAuthModalClose} 
          initialMode={authModalMode} 
        />
      </>
    );
  }

  // Show job description step if we're in job step
  if (currentStep === 'job') {
    return (
      <>
        <JobDescriptionStep onContinue={handleJobContinue} onBack={() => setCurrentStep('validation')} isGeneratingSummary={isGeneratingSummary} />
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={handleAuthModalClose} 
          initialMode={authModalMode} 
        />
      </>
    );
  }

  // Show download step if we're in download step
  if (currentStep === 'download') {
    return (
      <div className="frontpage-bg">
        <div className="frontpage-bg-glow1" />
        <div className="frontpage-bg-glow2" />
        <div className="frontpage-bg-glow3" />
        <Navbar onAuthClick={handleAuthClick} user={user} isAuthenticated={isAuthenticated()} />
        <ProgressSteps currentStepIndex={5} />
        <div className="frontpage-content">
          <div className="frontpage-hero-section">
            <div className="frontpage-hero-text">
              <h1>🎉 <span className="gradient-text">CV optimisé prêt !</span></h1>
              <p className="hero-subtitle">
                Votre CV a été généré avec le template {selectedTemplate?.name} et adapté aux exigences du poste.
              </p>
            </div>
            <div className="frontpage-upload-simple">
              {generatedPDFData ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    background: 'rgba(30,34,44,0.8)', 
                    padding: '20px', 
                    borderRadius: '12px', 
                    marginBottom: '20px',
                    border: '1px solid #444'
                  }}>
                    <h3 style={{ color: '#00ff99', marginBottom: '10px' }}>CV Généré avec Succès</h3>
                    <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '15px' }}>
                      Template: <strong>{selectedTemplate?.name}</strong><br/>
                      Fichier: {generatedPDFData.pdf_file?.filename}<br/>
                      Taille: {(generatedPDFData.pdf_file?.size_bytes / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  
                  <button 
                    className="frontpage-upload-btn" 
                    onClick={() => {
                      // Télécharger le PDF
                      const link = document.createElement('a');
                      link.href = `http://localhost:8000/download_pdf/${generatedPDFData.pdf_file?.cv_id}`;
                      link.download = generatedPDFData.pdf_file?.filename || 'cv_optimise.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    style={{ backgroundColor: GREEN, color: '#000', fontWeight: 'bold' }}
                  >
                    <FaDownload style={{ marginRight: 8 }} />
                    Télécharger le CV PDF
                  </button>
                  
                  <button 
                    className="frontpage-upload-btn" 
                    onClick={() => {
                      // Télécharger les données JSON
                      const link = document.createElement('a');
                      link.href = `http://localhost:8000/download_json/${generatedPDFData.json_file?.cv_id}`;
                      link.download = generatedPDFData.json_file?.filename || 'cv_data.json';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    style={{ 
                      backgroundColor: 'transparent', 
                      color: GREEN, 
                      border: `2px solid ${GREEN}`,
                      marginTop: 12
                    }}
                  >
                    📄 Télécharger les données JSON
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#ff9800' }}>
                  ⚠️ Erreur: Données PDF non disponibles
                </div>
              )}
              
              <button 
                className="frontpage-upload-btn" 
                onClick={() => setCurrentStep('upload')}
                style={{ 
                  backgroundColor: 'transparent', 
                  color: GREEN, 
                  border: `2px solid ${GREEN}`,
                  marginTop: 16
                }}
              >
                Traiter un autre CV
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'template-selection') {
    return (
      <div className="frontpage-bg">
        <div className="frontpage-bg-glow1" />
        <div className="frontpage-bg-glow2" />
        <div className="frontpage-bg-glow3" />
        <Navbar onAuthClick={handleAuthClick} user={user} isAuthenticated={isAuthenticated()} />
        <TemplateSelectionStep
          onTemplateSelect={handleTemplateSelect}
          onBack={handleBackToExperiences}
          selectedTemplate={selectedTemplate}
          userData={(() => {
            const userDataWithExperiences = {
              ...validatedData,
              // Informations personnelles - extraction depuis personal_information
              name: validatedData?.personal_information?.name || validatedData?.name || validatedData?.full_name || 'Nom Prénom',
              title: validatedData?.personal_information?.title || validatedData?.title || validatedData?.job_title || validatedData?.position || 'Poste',
              email: validatedData?.personal_information?.email || validatedData?.email || validatedData?.email_address || 'email@example.com',
              phone: validatedData?.personal_information?.phone || validatedData?.phone || validatedData?.phone_number || validatedData?.telephone || '+33 6 12 34 56 78',
              location: validatedData?.personal_information?.location || validatedData?.location || validatedData?.address || validatedData?.city || 'Ville, Pays',
              linkedin: validatedData?.personal_information?.linkedin || validatedData?.linkedin || validatedData?.linkedin_url || 'linkedin.com/in/profile',
              summary: validatedData?.personal_information?.summary || validatedData?.summary || validatedData?.profile || validatedData?.about || 'Résumé professionnel...',
              // Expériences alignées
              experiences: alignmentPairs.map(pair => ({
                title: pair.new.title || pair.old.title,
                company: pair.new.company || pair.old.company,
                location: pair.new.location || pair.old.location,
                startDate: pair.new.startDate || pair.old.startDate,
                endDate: pair.new.endDate || pair.old.endDate,
                description: pair.new.description || pair.old.description,
                alignedDescription: pair.new.description || pair.old.description
              })),
              // Compétences
              skills: Object.keys(jobSkills).length > 0 ? Object.keys(jobSkills) : [],
              // Formation
              education: validatedData?.education || validatedData?.education_history || []
            };
            console.log('🔍 Debug - userData passed to TemplateSelectionStep:', userDataWithExperiences);
            console.log('🔍 Debug - validatedData structure:', validatedData);
            console.log('🔍 Debug - personal_information:', validatedData?.personal_information);
            return userDataWithExperiences;
          })()}
          jobSummary={jobSummary}
        />
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={handleAuthModalClose} 
          initialMode={authModalMode} 
        />
      </div>
    );
  }

  if (currentStep === 'compare-experiences') {
    return (
      <div className="frontpage-bg">
        <div className="frontpage-bg-glow1" />
        <div className="frontpage-bg-glow2" />
        <div className="frontpage-bg-glow3" />
        <Navbar onAuthClick={handleAuthClick} user={user} isAuthenticated={isAuthenticated()} />
        <ExperienceComparisonStep
          alignmentPairs={alignmentPairs}
          onAlignmentPairsChange={setAlignmentPairs}
          onContinue={handleExperiencesContinue}
          onBack={handleBackToJob}
          isAligningExperiences={isAligningExperiences}
          jobDescription={jobDescription}
          jobSummary={jobSummary}
          resumeSkills={resumeSkills}
          jobSkills={jobSkills}
          validatedData={validatedData}
        />
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={handleAuthModalClose} 
          initialMode={authModalMode} 
        />
      </div>
    );
  }

  return (
    <div className="frontpage-bg">
      {/* Extra animated color layers for alternating intensity */}
      <div className="frontpage-bg-glow1" />
      <div className="frontpage-bg-glow2" />
      <div className="frontpage-bg-glow3" />
      <Navbar onAuthClick={handleAuthClick} user={user} isAuthenticated={isAuthenticated()} />
      {currentStep !== 'upload' && currentStep !== 'validation' && (
        <ProgressSteps currentStepIndex={
          currentStep === 'job' ? 2 : 
          currentStep === 'compare-experiences' ? 3 : 
          currentStep === 'template-selection' ? 4 :
          currentStep === 'download' ? 5 : 1
        } />
      )}
      <div className="frontpage-content">
        <div className="frontpage-hero-section">
          <div className="frontpage-hero-text">
            <h1>Une IA qui <span className="gradient-text">optimise votre CV</span> aux exigences de chaque poste</h1>
            <p className="hero-subtitle">75% des CV sont rejetés avant même d'être vus par un recruteur à cause des systèmes de filtrage automatisé</p>
          </div>
        <div className="frontpage-upload-simple">
          <input
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button className="frontpage-upload-btn" onClick={handleButtonClick}>
            Charger votre CV
          </button>
          {uploadStatus && (
            <div className={`upload-status ${uploadStatus}`}>
              {getStatusIcon()}
              <span className="status-message">{statusMessage}</span>
            </div>
          )}
          <div className="frontpage-powered-by">
            <span>Propulsé par</span>
            <div className="mistral-logo">
              <img src="/mistral_logo_rotating.gif" alt="Mistral" />
              <span className="mistral-text">Mistral AI</span>
            </div>
          </div>
          </div>
        </div>
        <ATSOptimizationSection />
        
        {/* Footer */}
        <footer className="frontpage-footer">
          <div className="footer-content">
            <div className="footer-left">
              <span>Copyright © 2025 CVIA, Inc. All rights reserved.</span>
            </div>
            <div className="footer-right">
              <span>Terms of Use & Privacy Policy</span>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={handleAuthModalClose} 
        initialMode={authModalMode} 
      />
    </div>
  );
} 