// src/components/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Option 1 : Export par défaut (recommandé)
const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '4rem', color: '#ff4444' }}>404</h1>
      <h2>Page non trouvée</h2>
      <p>La page que vous recherchez n'existe pas.</p>
      <Link 
        to="/" 
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px'
        }}
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFound; // <-- C'EST CETTE LIGNE QUI MANQUE PEUT-ÊTRE