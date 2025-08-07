import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SocialAuthCallback = () => {
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const provider = urlParams.get('provider');
      const isNewUser = urlParams.get('new_user') === 'true';
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('description');

      if (error) {
        // Send error to parent window
        window.opener?.postMessage({
          type: 'SOCIAL_AUTH_ERROR',
          error: errorDescription || error
        }, window.location.origin);
        window.close();
        return;
      }

      if (token) {
        // Decode user data from token (you might want to fetch user data from API instead)
        try {
          // For now, we'll fetch user data using the token
          fetch('http://localhost:8000/api/v1/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          .then(response => response.json())
          .then(userData => {
            // Send success data to parent window
            window.opener?.postMessage({
              type: 'SOCIAL_AUTH_SUCCESS',
              token: token,
              user: userData,
              provider: provider,
              isNewUser: isNewUser
            }, window.location.origin);
            window.close();
          })
          .catch(error => {
            window.opener?.postMessage({
              type: 'SOCIAL_AUTH_ERROR',
              error: 'Failed to fetch user data'
            }, window.location.origin);
            window.close();
          });
        } catch (error) {
          window.opener?.postMessage({
            type: 'SOCIAL_AUTH_ERROR',
            error: 'Invalid token received'
          }, window.location.origin);
          window.close();
        }
      } else {
        window.opener?.postMessage({
          type: 'SOCIAL_AUTH_ERROR',
          error: 'No authentication token received'
        }, window.location.origin);
        window.close();
      }
    };

    // Handle the callback when component mounts
    handleCallback();
  }, []);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #1a1d29 0%, #2a2d3a 100%)',
      color: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #00ff99',
          borderTop: '3px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <h2>Authentification en cours...</h2>
        <p>Veuillez patienter pendant que nous finalisons votre connexion.</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SocialAuthCallback;