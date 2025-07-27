import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGlobe, FaGraduationCap, FaBriefcase, FaCode, FaTrophy, FaProjectDiagram } from 'react-icons/fa';
import './ResumeViewer.css';

const ResumeViewer = ({ ocrResultId }) => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ocrResultId) {
      fetchResumeData(ocrResultId);
    }
  }, [ocrResultId]);

  const fetchResumeData = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8000/extract_resume/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResumeData(data.extracted_data || data);
    } catch (err) {
      console.error('Error fetching resume data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalInfo = (data) => {
    if (!data.name && !data.email && !data.phone) return null;
    
    return (
      <div className="resume-section">
        <h2 className="section-title">
          <FaUser className="section-icon" />
          Informations Personnelles
        </h2>
        <div className="personal-info">
          {data.name && (
            <div className="info-item">
              <strong>Nom:</strong> {data.name}
            </div>
          )}
          {data.email && (
            <div className="info-item">
              <FaEnvelope className="info-icon" />
              <strong>Email:</strong> {data.email}
            </div>
          )}
          {data.phone && (
            <div className="info-item">
              <FaPhone className="info-icon" />
              <strong>Téléphone:</strong> {data.phone}
            </div>
          )}
          {data.location && (
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <strong>Localisation:</strong> {data.location}
            </div>
          )}
          {data.linkedin && (
            <div className="info-item">
              <FaLinkedin className="info-icon" />
              <strong>LinkedIn:</strong> 
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer">
                {data.linkedin}
              </a>
            </div>
          )}
          {data.website && (
            <div className="info-item">
              <FaGlobe className="info-icon" />
              <strong>Site Web:</strong> 
              <a href={data.website} target="_blank" rel="noopener noreferrer">
                {data.website}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSummary = (data) => {
    if (!data.summary) return null;
    
    return (
      <div className="resume-section">
        <h2 className="section-title">Résumé Professionnel</h2>
        <p className="summary-text">{data.summary}</p>
      </div>
    );
  };

  const renderExperience = (data) => {
    if (!data.experience || !Array.isArray(data.experience) || data.experience.length === 0) return null;
    
    return (
      <div className="resume-section">
        <h2 className="section-title">
          <FaBriefcase className="section-icon" />
          Expérience Professionnelle
        </h2>
        <div className="experience-list">
          {data.experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-header">
                <h3 className="job-title">{exp.position}</h3>
                <span className="company-name">{exp.company}</span>
              </div>
              <div className="experience-details">
                <span className="date-range">
                  {exp.start_date} - {exp.end_date || 'Présent'}
                </span>
                {exp.location && <span className="location">{exp.location}</span>}
              </div>
              {exp.description && (
                <p className="job-description">{exp.description}</p>
              )}
              {exp.achievements && Array.isArray(exp.achievements) && (
                <ul className="achievements-list">
                  {exp.achievements.map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducation = (data) => {
    if (!data.education || !Array.isArray(data.education) || data.education.length === 0) return null;
    
    return (
      <div className="resume-section">
        <h2 className="section-title">
          <FaGraduationCap className="section-icon" />
          Formation
        </h2>
        <div className="education-list">
          {data.education.map((edu, index) => (
            <div key={index} className="education-item">
              <div className="education-header">
                <h3 className="degree">{edu.degree}</h3>
                <span className="institution">{edu.institution}</span>
              </div>
              <div className="education-details">
                {edu.field && <span className="field">{edu.field}</span>}
                {edu.graduation_date && <span className="graduation-date">{edu.graduation_date}</span>}
                {edu.gpa && <span className="gpa">GPA: {edu.gpa}</span>}
                {edu.location && <span className="location">{edu.location}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = (data) => {
    if (!data.skills) return null;
    
    const skills = data.skills;
    const hasSkills = skills.technical_skills || skills.soft_skills || skills.languages || skills.certifications;
    
    if (!hasSkills) return null;
    
    return (
      <div className="resume-section">
        <h2 className="section-title">
          <FaCode className="section-icon" />
          Compétences
        </h2>
        <div className="skills-container">
          {skills.technical_skills && (
            <div className="skill-category">
              <h3>Compétences Techniques</h3>
              <div className="skill-tags">
                {Array.isArray(skills.technical_skills) 
                  ? skills.technical_skills.map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))
                  : <span className="skill-tag">{skills.technical_skills}</span>
                }
              </div>
            </div>
          )}
          {skills.soft_skills && (
            <div className="skill-category">
              <h3>Compétences Générales</h3>
              <div className="skill-tags">
                {Array.isArray(skills.soft_skills) 
                  ? skills.soft_skills.map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))
                  : <span className="skill-tag">{skills.soft_skills}</span>
                }
              </div>
            </div>
          )}
          {skills.languages && (
            <div className="skill-category">
              <h3>Langues</h3>
              <div className="skill-tags">
                {Array.isArray(skills.languages) 
                  ? skills.languages.map((lang, idx) => (
                      <span key={idx} className="skill-tag">{lang}</span>
                    ))
                  : <span className="skill-tag">{skills.languages}</span>
                }
              </div>
            </div>
          )}
          {skills.certifications && (
            <div className="skill-category">
              <h3>Certifications</h3>
              <div className="skill-tags">
                {Array.isArray(skills.certifications) 
                  ? skills.certifications.map((cert, idx) => (
                      <span key={idx} className="skill-tag">{cert}</span>
                    ))
                  : <span className="skill-tag">{skills.certifications}</span>
                }
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProjects = (data) => {
    if (!data.projects || !Array.isArray(data.projects) || data.projects.length === 0) return null;
    
    return (
      <div className="resume-section">
        <h2 className="section-title">
          <FaProjectDiagram className="section-icon" />
          Projets
        </h2>
        <div className="projects-list">
          {data.projects.map((project, index) => (
            <div key={index} className="project-item">
              <div className="project-header">
                <h3 className="project-name">{project.name}</h3>
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-link">
                    Voir le projet
                  </a>
                )}
              </div>
              {project.description && (
                <p className="project-description">{project.description}</p>
              )}
              {project.technologies && (
                <div className="project-technologies">
                  <strong>Technologies:</strong> {project.technologies}
                </div>
              )}
              {project.date && (
                <div className="project-date">
                  <strong>Date:</strong> {project.date}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAdditional = (data) => {
    const additionalSections = [];
    
    if (data.awards) additionalSections.push({ title: 'Prix et Distinctions', content: data.awards });
    if (data.publications) additionalSections.push({ title: 'Publications', content: data.publications });
    if (data.volunteer) additionalSections.push({ title: 'Bénévolat', content: data.volunteer });
    if (data.interests) additionalSections.push({ title: 'Centres d\'intérêt', content: data.interests });
    
    if (additionalSections.length === 0) return null;
    
    return (
      <div className="resume-section">
        <h2 className="section-title">
          <FaTrophy className="section-icon" />
          Informations Supplémentaires
        </h2>
        {additionalSections.map((section, index) => (
          <div key={index} className="additional-item">
            <h3>{section.title}</h3>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="resume-viewer">
        <div className="loading">Chargement des données du CV...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="resume-viewer">
        <div className="error">
          Erreur lors du chargement: {error}
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="resume-viewer">
        <div className="no-data">Aucune donnée de CV disponible</div>
      </div>
    );
  }

  return (
    <div className="resume-viewer">
      <div className="resume-content">
        {renderPersonalInfo(resumeData)}
        {renderSummary(resumeData)}
        {renderExperience(resumeData)}
        {renderEducation(resumeData)}
        {renderSkills(resumeData)}
        {renderProjects(resumeData)}
        {renderAdditional(resumeData)}
      </div>
    </div>
  );
};

export default ResumeViewer; 