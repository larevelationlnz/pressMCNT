import React from 'react';
import { ChartIcon } from '../icons/CustomIcons';

const DashboardHome = ({ authorsCount }) => {
  return (
    <div className="content-area fade-in">
      <div className="content-header">
        <div className="content-title-wrapper">
          <span className="content-title-icon">
            <ChartIcon size={28} />
          </span>
          <h2 className="content-title">Vue d'ensemble</h2>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{authorsCount}</div>
          <div className="stat-label">Auteurs Actifs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">12</div>
          <div className="stat-label">Publications</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">94%</div>
          <div className="stat-label">Engagement</div>
        </div>
      </div>

      <div className="dashboard-placeholder" style={{ minHeight: '220px', marginTop: '12px' }}>
        <h3 className="placeholder-title" style={{ fontSize: '1.1rem' }}>Rapport d'activité récent</h3>
        <p className="placeholder-text" style={{ fontSize: '0.9rem', maxWidth: '400px' }}>
          Toutes les opérations système fonctionnent normalement. Les bases de données des auteurs et des publications sont synchronisées.
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;
