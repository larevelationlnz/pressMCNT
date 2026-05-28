import React from 'react';
import { DocumentIcon } from '../icons/CustomIcons';

const PublicationsManager = () => {
  return (
    <div className="content-area fade-in">
      <div className="content-header">
        <div className="content-title-wrapper">
          <span className="content-title-icon">
            <DocumentIcon size={28} />
          </span>
          <h2 className="content-title">Gestion des publications</h2>
        </div>
      </div>

      <div className="dashboard-placeholder">
        <span className="placeholder-icon">
          <DocumentIcon size={48} />
        </span>
        <h3 className="placeholder-title">Module des publications</h3>
        <p className="placeholder-text">
          Cet espace permet de gérer les articles, revues et documents associés aux différents auteurs enregistrés.
        </p>
      </div>
    </div>
  );
};

export default PublicationsManager;
