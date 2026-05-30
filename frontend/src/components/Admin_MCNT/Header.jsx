import React from 'react';

const Header = ({ user, onLogout }) => {
  return (
    <header 
      className="app-header fade-in" 
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '16px',
        backgroundColor: '#e3f2fd', /* Soft light blue/pastel blue matching mockup */
        border: '1px solid #bbdefb',
        padding: '16px 24px',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '10px'
      }}
    >
      {/* Spacer to keep title centered */}
      <div style={{ width: '120px', display: 'flex', alignItems: 'center', fontWeight: 600, color: '#5c6bc0', fontSize: '0.9rem', whiteSpace: 'nowrap' }} className="header-spacer-left">
        {user ? `👤 ${user.firstName} ${user.lastName}` : ''}
      </div>

      <h1 
        style={{ 
          margin: 0, 
          flex: 1, 
          textAlign: 'center',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#5c6bc0', /* Dark greyish blue matching mockup */
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }}
      >
        TABLEAU DE BORD ADMIN
      </h1>

      <button 
        className="btn-deconnecter" 
        onClick={onLogout}
        style={{ 
          fontSize: '0.85rem', 
          fontWeight: 700,
          padding: '8px 16px', 
          borderRadius: 'var(--radius-sm)',
          border: '1.5px solid #e53935', 
          color: '#e53935',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all var(--transition-fast)',
          cursor: 'pointer'
        }}
      >
        Déconnecter
      </button>
    </header>
  );
};

export default Header;