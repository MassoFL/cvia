import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import FrontPage from './FrontPage';

function App() {
  return (
    <AuthProvider>
      <FrontPage />
    </AuthProvider>
  );
}

export default App;
