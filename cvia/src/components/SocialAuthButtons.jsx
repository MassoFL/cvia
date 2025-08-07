import React, { useState } from 'react';
import { FaGoogle, FaLinkedin, FaGithub, FaMicrosoft, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import './SocialAuthButtons.css';

const SocialAuthButtons = ({ onSuccess, onError }) => {
  const [loadingProvider, setLoadingProvider] = useState(null);
  const { login } = useAuth();

  const socialProviders = [
    {
      name: 'google',
      displayName: 'Google',
      icon: <FaGoogle />,
      color: '#db4437',
      bgColor: '#fff',
      textColor: '#333'
    },
    {
      name: 'linkedin',
      displayName: 'LinkedIn',
      icon: <FaLinkedin />,
      color: '#0077b5',
      bgColor: '#0077b5',
      textColor: '#fff'
    },
    {
      name: 'github',
      displayName: 'GitHub',
      icon: <FaGithub />,
      color: '#333',
      bgColor: '#333',
      textColor: '#fff'
    },
    {
      name: 'microsoft',
      displayName: 'Microsoft',
      icon: <FaMicrosoft />,
      color: '#00a1f1',
      bgColor: '#00a1f1',
      textColor: '#fff'
    }
  ];

  const handleSocialLogin = async (provider) => {
    try {
      setLoadingProvider(provider.name);
      
      // Get OAuth URL from backend
      const response = await fetch(`http://localhost:8000/api/v1/social/auth/${provider.name}`);
      
      if (!response.ok) {
        throw new Error(`Failed to initiate ${provider.displayName} authentication`);
      }
      
      const data = await response.json();
      
      // Open OAuth popup
      const popup = window.open(
        data.auth_url,
        `${provider.name}_auth`,
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );
      
      // Listen for popup messages
      const handleMessage = async (event) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'SOCIAL_AUTH_SUCCESS') {
          popup.close();
          window.removeEventListener('message', handleMessage);
          
          // Store token and user data
          localStorage.setItem('cvia_token', event.data.token);
          localStorage.setItem('cvia_user', JSON.stringify(event.data.user));
          
          if (onSuccess) {
            onSuccess({
              user: event.data.user,
              provider: event.data.provider,
              isNewUser: event.data.isNewUser
            });
          }
          
          setLoadingProvider(null);
        } else if (event.data.type === 'SOCIAL_AUTH_ERROR') {
          popup.close();
          window.removeEventListener('message', handleMessage);
          
          if (onError) {
            onError(event.data.error);
          }
          
          setLoadingProvider(null);
        }
      };
      
      window.addEventListener('message', handleMessage);
      
      // Check if popup was closed manually
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          setLoadingProvider(null);
        }
      }, 1000);
      
    } catch (error) {
      console.error(`${provider.displayName} auth error:`, error);
      if (onError) {
        onError(error.message);
      }
      setLoadingProvider(null);
    }
  };

  return (
    <div className="social-auth-buttons">
      <div className="social-auth-divider">
        <span>ou continuer avec</span>
      </div>
      
      <div className="social-buttons-grid">
        {socialProviders.map((provider) => (
          <button
            key={provider.name}
            className="social-auth-btn"
            style={{
              backgroundColor: provider.bgColor,
              color: provider.textColor,
              borderColor: provider.color
            }}
            onClick={() => handleSocialLogin(provider)}
            disabled={loadingProvider !== null}
          >
            {loadingProvider === provider.name ? (
              <FaSpinner className="social-spinner" />
            ) : (
              <>
                <span className="social-icon" style={{ color: provider.color }}>
                  {provider.icon}
                </span>
                <span className="social-text">{provider.displayName}</span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialAuthButtons;