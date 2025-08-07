import React, { useState } from 'react';
import { FaTimes, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import SocialAuthButtons from './SocialAuthButtons';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const { login, register } = useAuth();

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      confirmPassword: ''
    });
    setErrors({});
    setGeneralError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (mode === 'signup') {
      if (!/(?=.*[a-z])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!/(?=.*[A-Z])/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!/(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
      }
    }

    if (mode === 'signup') {
      // First name validation
      if (!formData.first_name) {
        newErrors.first_name = 'First name is required';
      } else if (formData.first_name.length < 2) {
        newErrors.first_name = 'First name must be at least 2 characters';
      }

      // Last name validation
      if (!formData.last_name) {
        newErrors.last_name = 'Last name is required';
      } else if (formData.last_name.length < 2) {
        newErrors.last_name = 'Last name must be at least 2 characters';
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setGeneralError('');

    try {
      let result;
      
      if (mode === 'login') {
        result = await login(formData.email, formData.password);
      } else {
        result = await register({
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name
        });
      }

      if (result.success) {
        handleClose();
      } else {
        setGeneralError(result.error || 'An error occurred');
      }
    } catch (error) {
      setGeneralError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSocialAuthSuccess = (data) => {
    console.log('Social auth success:', data);
    // The SocialAuthButtons component already handles token storage
    // Just close the modal
    handleClose();
  };

  const handleSocialAuthError = (error) => {
    console.error('Social auth error:', error);
    setGeneralError(error || 'Social authentication failed');
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2>{mode === 'login' ? 'Se connecter' : 'Créer un compte'}</h2>
          <button className="auth-modal-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <div className="auth-modal-content">
          {generalError && (
            <div className="auth-error-message">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'signup' && (
              <>
                <div className="auth-form-row">
                  <div className="auth-form-group">
                    <label htmlFor="first_name">Prénom</label>
                    <div className="auth-input-wrapper">
                      <FaUser className="auth-input-icon" />
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className={errors.first_name ? 'error' : ''}
                        placeholder="Votre prénom"
                      />
                    </div>
                    {errors.first_name && <span className="auth-field-error">{errors.first_name}</span>}
                  </div>

                  <div className="auth-form-group">
                    <label htmlFor="last_name">Nom</label>
                    <div className="auth-input-wrapper">
                      <FaUser className="auth-input-icon" />
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className={errors.last_name ? 'error' : ''}
                        placeholder="Votre nom"
                      />
                    </div>
                    {errors.last_name && <span className="auth-field-error">{errors.last_name}</span>}
                  </div>
                </div>
              </>
            )}

            <div className="auth-form-group">
              <label htmlFor="email">Email</label>
              <div className="auth-input-wrapper">
                <FaEnvelope className="auth-input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && <span className="auth-field-error">{errors.email}</span>}
            </div>

            <div className="auth-form-group">
              <label htmlFor="password">Mot de passe</label>
              <div className="auth-input-wrapper">
                <FaLock className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? 'error' : ''}
                  placeholder={mode === 'signup' ? 'Min. 8 caractères, 1 maj, 1 min, 1 chiffre' : 'Votre mot de passe'}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className="auth-field-error">{errors.password}</span>}
            </div>

            {mode === 'signup' && (
              <div className="auth-form-group">
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <div className="auth-input-wrapper">
                  <FaLock className="auth-input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Confirmez votre mot de passe"
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword}</span>}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="auth-spinner" />
                  {mode === 'login' ? 'Connexion...' : 'Création...'}
                </>
              ) : (
                mode === 'login' ? 'Se connecter' : 'Créer le compte'
              )}
            </button>
          </form>

          {/* Social Authentication Buttons */}
          <SocialAuthButtons 
            onSuccess={handleSocialAuthSuccess}
            onError={handleSocialAuthError}
          />

          <div className="auth-switch">
            {mode === 'login' ? (
              <p>
                Pas encore de compte ?{' '}
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => switchMode('signup')}
                >
                  Créer un compte
                </button>
              </p>
            ) : (
              <p>
                Déjà un compte ?{' '}
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => switchMode('login')}
                >
                  Se connecter
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;